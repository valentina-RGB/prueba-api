import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';

describe('SendStoreApprovedEmailUseCase', () => {
  let sendStoreApprovedEmailUseCase: SendStoreApprovedEmailUseCase;
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

  const mockFrontendUrl = 'http://test-url.com';

  beforeEach(async () => {
    const mockNodemailerService = {
      createEmailTemplate: jest.fn(),
      sendEmail: jest.fn(),
    };

    const mockTemplateService = {
      loadTemplate: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(mockFrontendUrl),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SendStoreApprovedEmailUseCase,
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

    sendStoreApprovedEmailUseCase =
      moduleFixture.get<SendStoreApprovedEmailUseCase>(
        SendStoreApprovedEmailUseCase,
      );
    nodemailerService = moduleFixture.get<NodemailerService>(NodemailerService);
    templateService = moduleFixture.get<TemplateService>(TemplateService);
  });

  it('should send a welcome email successfully', async () => {
    const mockHtmlContent = '<html>Store Approved!</html>';
    const mockEmailHtml = '<html><body>Bienvenido a Encafeinados</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(
      sendStoreApprovedEmailUseCase.execute(mockBranch),
    ).resolves.not.toThrow();

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'store-approved',
      {
        storeName: mockBranch.store.name,
        storeId: mockBranch.store.id,
        branchName: mockBranch.name,
        branchAddress: mockBranch.address,
        urlBase: mockFrontendUrl,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Bienvenido a Encafeinados',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: mockBranch.store.email,
      subject: 'Welcome to Encafeinados!',
      html: mockEmailHtml,
    });
  });

  it('should throw an error if email sending fails', async () => {
    const mockHtmlContent = '<html>Store Approved!</html>';
    const mockEmailHtml = '<html><body>Bienvenido a Encafeinados</body></html>';

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
      sendStoreApprovedEmailUseCase.execute(mockBranch),
    ).rejects.toThrow('Failed to send email');

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'store-approved',
      {
        storeName: mockBranch.store.name,
        storeId: mockBranch.store.id,
        branchName: mockBranch.name,
        branchAddress: mockBranch.address,
        urlBase: mockFrontendUrl,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Bienvenido a Encafeinados',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: mockBranch.store.email,
      subject: 'Welcome to Encafeinados!',
      html: mockEmailHtml,
    });
  });
});
