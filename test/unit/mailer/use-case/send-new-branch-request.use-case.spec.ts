import { Test, TestingModule } from '@nestjs/testing';
import { SendNewStoreRequestEmailUseCase } from 'src/modules/mailer/application/use-cases/send-new-branch-request.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';
import { ConfigService } from '@nestjs/config';

describe('SendNewStoreRequestEmailUseCase', () => {
  let sendNewStoreRequestEmailUseCase: SendNewStoreRequestEmailUseCase;
  let nodemailerService: NodemailerService;
  let templateService: TemplateService;
  let configService: ConfigService;

  const mockStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'test-logo.png',
    phone_number: '3011234567',
    email: 'store@example.com',
    status: 'PENDING',
  };

  const mockBranch = {
    id: 1,
    store: mockStore,
    name: 'New Branch',
    phone_number: '3001234567',
    latitude: 10.12345,
    longitude: -75.6789,
    address: '123 Main Street',
    is_open: false,
    status: 'PENDING',
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

    const mockConfigService = {
      get: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SendNewStoreRequestEmailUseCase,
        {
          provide: NodemailerService,
          useValue: mockNodemailerService,
        },
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    sendNewStoreRequestEmailUseCase =
      moduleFixture.get<SendNewStoreRequestEmailUseCase>(
        SendNewStoreRequestEmailUseCase,
      );
    nodemailerService = moduleFixture.get<NodemailerService>(NodemailerService);
    templateService = moduleFixture.get<TemplateService>(TemplateService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  it('should send new store request emails to all admins', async () => {
    const adminEmails = ['admin1@example.com', 'admin2@example.com'];
    const adminNames = ['Admin One', 'Admin Two'];
    const mockHtmlContent = '<html>New Store Request!</html>';
    const mockEmailHtml =
      '<html><body>Solicitud de Revisión de Nueva Tienda</body></html>';
    const mockUrlBase = 'https://frontend.example.com';

    jest.spyOn(configService, 'get').mockReturnValue(mockUrlBase);
    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(
      sendNewStoreRequestEmailUseCase.execute(
        mockBranch,
        adminEmails,
        adminNames,
      ),
    ).resolves.not.toThrow();

    adminEmails.forEach((email, index) => {
      const expectedTemplateContext = {
        adminName: adminNames[index],
        branchName: mockBranch.name,
        branchAddress: mockBranch.address,
        branchPhone: mockBranch.phone_number,
        storeEmail: mockBranch.store.email,
        storeName: mockBranch.store.name,
        urlBase: mockUrlBase,
      };

      expect(templateService.loadTemplate).toHaveBeenCalledWith(
        'new-store-request',
        expectedTemplateContext,
      );

      expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
        mockHtmlContent,
        'Solicitud de Revisión de Nueva Tienda',
      );

      expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
        to: email,
        subject: 'Solicitud de Revisión de Nueva Tienda',
        html: mockEmailHtml,
      });
    });
  });

  it('should throw an error if sending any email fails', async () => {
    const adminEmails = ['admin1@example.com'];
    const adminNames = ['Admin One'];
    const mockHtmlContent = '<html>New Store Request!</html>';
    const mockEmailHtml =
      '<html><body>Solicitud de Revisión de Nueva Tienda</body></html>';
    const mockUrlBase = 'https://frontend.example.com';

    jest.spyOn(configService, 'get').mockReturnValue(mockUrlBase);
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
      sendNewStoreRequestEmailUseCase.execute(
        mockBranch,
        adminEmails,
        adminNames,
      ),
    ).rejects.toThrow('Failed to send email');

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'new-store-request',
      expect.objectContaining({
        adminName: adminNames[0],
        branchName: mockBranch.name,
      }),
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Solicitud de Revisión de Nueva Tienda',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: adminEmails[0],
      subject: 'Solicitud de Revisión de Nueva Tienda',
      html: mockEmailHtml,
    });
  });
});
