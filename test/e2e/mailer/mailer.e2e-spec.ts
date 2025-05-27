import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';
import { SendWelcomeEmailUseCase } from 'src/modules/mailer/application/use-cases/send-client-welcome-email.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';

describe('Email Use Cases (e2e)', () => {
  let nodemailerService: NodemailerService;
  let templateService: TemplateService;

  let sendStoreApprovedEmailUseCase: SendStoreApprovedEmailUseCase;
  let sendStoreRejectionEmailUseCase: SendStoreRejectionEmailUseCase;
  let sendWelcomeEmailUseCase: SendWelcomeEmailUseCase;

  const mockFrontendUrl = 'http://test-url.com';

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
      sendEmail: jest.fn(),
      createEmailTemplate: jest.fn(),
    };

    const mockTemplateService = {
      loadTemplate: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(mockFrontendUrl),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
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
        SendStoreApprovedEmailUseCase,
        SendStoreRejectionEmailUseCase,
        SendWelcomeEmailUseCase,
      ],
    }).compile();

    nodemailerService = moduleFixture.get<NodemailerService>(NodemailerService);
    templateService = moduleFixture.get<TemplateService>(TemplateService);

    sendStoreApprovedEmailUseCase =
      moduleFixture.get<SendStoreApprovedEmailUseCase>(
        SendStoreApprovedEmailUseCase,
      );
    sendStoreRejectionEmailUseCase =
      moduleFixture.get<SendStoreRejectionEmailUseCase>(
        SendStoreRejectionEmailUseCase,
      );
    sendWelcomeEmailUseCase = moduleFixture.get<SendWelcomeEmailUseCase>(
      SendWelcomeEmailUseCase,
    );
  });

  it('should send a store welcome email successfully', async () => {
    const store = { name: 'Coffee Shop', email: 'store@example.com', id: 1 };
    const mockHtmlContent = '<html>Welcome to Coffee Shop!</html>';
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

  it('should send a store rejection email successfully', async () => {
    const comments = 'Your store application did not meet our criteria.';
    const mockHtmlContent = '<html>Your store application was rejected.</html>';
    const mockEmailHtml = '<html><body>Solicitud Rechazada</body></html>';

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

  it('should send a welcome email to a user successfully', async () => {
    const client = {
      person: {
        full_name: 'Jane Doe',
        user: {
          email: 'jane.doe@example.com',
        },
      },
    };
    const mockHtmlContent = '<html>Welcome Jane Doe!</html>';
    const mockEmailHtml =
      '<html><body>Bienvenido a Nuestra Plataforma</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(
      sendWelcomeEmailUseCase.execute(client),
    ).resolves.not.toThrow();

    expect(templateService.loadTemplate).toHaveBeenCalledWith(
      'welcome-client',
      {
        clientName: client.person.full_name,
      },
    );

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Bienvenido a Nuestra Plataforma',
    );
    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: client.person.user.email,
      subject:
        '¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱',
      html: mockEmailHtml,
    });
  });
});
