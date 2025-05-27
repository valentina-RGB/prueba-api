import { Test, TestingModule } from '@nestjs/testing';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';

describe('SendStoreRejectionEmailUseCase', () => {
  let sendStoreRejectionEmailUseCase: SendStoreRejectionEmailUseCase;
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
        SendStoreRejectionEmailUseCase,
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

    sendStoreRejectionEmailUseCase =
      moduleFixture.get<SendStoreRejectionEmailUseCase>(
        SendStoreRejectionEmailUseCase,
      );
    nodemailerService = moduleFixture.get<NodemailerService>(NodemailerService);
    templateService = moduleFixture.get<TemplateService>(TemplateService);
  });

  it('should send a rejection email successfully', async () => {
    const comments = 'Your store application did not meet our criteria.';

    const mockHtmlContent = '<html>Store Rejected!</html>';
    const mockEmailHtml =
      '<html><body>Solicitud de Tienda No Aprobada</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(
      sendStoreRejectionEmailUseCase.execute(mockBranch, comments),
    ).resolves.not.toThrow();

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'store-rejection',
      {
        storeName: mockBranch.store.name,
        storeId: mockBranch.store.id,
        branchName: mockBranch.name,
        rejectionReason: comments,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Solicitud de Tienda No Aprobada',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: mockBranch.store.email,
      subject: 'Store Rejection Notification',
      html: mockEmailHtml,
    });
  });

  it('should throw an error if email sending fails', async () => {
    const comments = 'Your store application did not meet our criteria.';

    const mockHtmlContent = '<html>Store Rejected!</html>';
    const mockEmailHtml =
      '<html><body>Solicitud de Tienda No Aprobada</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest
      .spyOn(nodemailerService, 'sendEmail')
      .mockRejectedValue(new Error('Failed to send email'));

    await expect(
      sendStoreRejectionEmailUseCase.execute(mockBranch, comments),
    ).rejects.toThrow('Failed to send email');

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'store-rejection',
      {
        storeName: mockBranch.store.name,
        storeId: mockBranch.store.id,
        branchName: mockBranch.name,
        rejectionReason: comments,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Solicitud de Tienda No Aprobada',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: mockBranch.store.email,
      subject: 'Store Rejection Notification',
      html: mockEmailHtml,
    });
  });
});
