import { Test, TestingModule } from '@nestjs/testing';
import { SendBranchProcessNotificationUseCase } from 'src/modules/mailer/application/use-cases/send-branch-process-notification.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';

describe('SendBranchProcessNotificationUseCase', () => {
  let useCase: SendBranchProcessNotificationUseCase;
  let nodemailerService: NodemailerService;
  let templateService: TemplateService;

  const mockStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'test-logo.png',
    phone_number: '3011234567',
    email: 'store@example.com',
    status: 'APPROVED',
  };

  const mockBranch = {
    id: 1,
    store: mockStore,
    name: 'New Branch',
    phone_number: '3001234567',
    latitude: 10.12345,
    longitude: -75.6789,
    address: '123 Main Street',
    is_open: true,
    status: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockNodemailerService = {
      createEmailTemplate: jest.fn(),
      sendEmail: jest.fn(),
    };

    const mockTemplateService = {
      loadTemplate: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SendBranchProcessNotificationUseCase,
        {
          provide: NodemailerService,
          useValue: mockNodemailerService,
        },
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    useCase = moduleFixture.get(SendBranchProcessNotificationUseCase);
    nodemailerService = moduleFixture.get(NodemailerService);
    templateService = moduleFixture.get(TemplateService);
  });

  it('should send branch process notification email successfully', async () => {
    const mockHtmlContent = '<html>Processing...</html>';
    const mockEmailHtml = '<html><body>Notificación enviada</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(useCase.execute(mockBranch)).resolves.not.toThrow();

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'branch-process-notification',
      {
        storeName: mockBranch.store.name,
        branchName: mockBranch.name,
        branchAddress: mockBranch.address,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Recibimos tu solicitud de registro',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: mockBranch.store.email,
      subject: 'Tu sucursal está en revisión',
      html: mockEmailHtml,
    });
  });

  it('should throw an error if email sending fails', async () => {
    const mockHtmlContent = '<html>Error test</html>';
    const mockEmailHtml = '<html><body>Error</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest
      .spyOn(nodemailerService, 'sendEmail')
      .mockRejectedValue(new Error('Failed to send email'));

    await expect(useCase.execute(mockBranch)).rejects.toThrow(
      'Failed to send email',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalled();
  });
});
