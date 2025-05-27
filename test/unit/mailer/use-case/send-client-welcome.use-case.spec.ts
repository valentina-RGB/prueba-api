import { Test, TestingModule } from '@nestjs/testing';
import { SendWelcomeEmailUseCase } from 'src/modules/mailer/application/use-cases/send-client-welcome-email.use-case';
import { NodemailerService } from 'src/modules/mailer/infrastructure/external-services/nodemailer.service';
import { TemplateService } from 'src/modules/mailer/infrastructure/external-services/template.service';

describe('SendWelcomeEmailUseCase', () => {
  let sendWelcomeEmailUseCase: SendWelcomeEmailUseCase;
  let nodemailerService: NodemailerService;
  let templateService: TemplateService;

  const clientData = {
    person: {
      full_name: 'John Doe',
      user: {
        email: 'john.doe@example.com',
      },
    },
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
        SendWelcomeEmailUseCase,
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

    sendWelcomeEmailUseCase = moduleFixture.get<SendWelcomeEmailUseCase>(
      SendWelcomeEmailUseCase,
    );
    nodemailerService = moduleFixture.get<NodemailerService>(NodemailerService);
    templateService = moduleFixture.get<TemplateService>(TemplateService);
  });

  it('should send a welcome email successfully', async () => {
    const mockHtmlContent = '<html>Welcome, John Doe!</html>';
    const mockEmailHtml =
      '<html><body>¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue(undefined);

    await expect(
      sendWelcomeEmailUseCase.execute(clientData),
    ).resolves.not.toThrow();

    expect(templateService.loadTemplate).toHaveBeenCalledWith('welcome-client', {
      clientName: clientData.person.full_name,
    });

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Bienvenido a Nuestra Plataforma',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: clientData.person.user.email,
      subject: '¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱',
      html: mockEmailHtml,
    });
  });

  it('should throw an error if email sending fails', async () => {
    const mockHtmlContent = '<html>Welcome, John Doe!</html>';
    const mockEmailHtml =
      '<html><body>¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱</body></html>';

    jest
      .spyOn(templateService, 'loadTemplate')
      .mockReturnValue(mockHtmlContent);
    jest
      .spyOn(nodemailerService, 'createEmailTemplate')
      .mockReturnValue(mockEmailHtml);
    jest
      .spyOn(nodemailerService, 'sendEmail')
      .mockRejectedValue(new Error('Failed to send email'));

    await expect(sendWelcomeEmailUseCase.execute(clientData)).rejects.toThrow(
      'Failed to send email',
    );

    expect(templateService.loadTemplate).toHaveBeenCalledWith('welcome-client', {
      clientName: clientData.person.full_name,
    });

    expect(nodemailerService.createEmailTemplate).toHaveBeenCalledWith(
      mockHtmlContent,
      'Bienvenido a Nuestra Plataforma',
    );

    expect(nodemailerService.sendEmail).toHaveBeenCalledWith({
      to: clientData.person.user.email,
      subject: '¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱',
      html: mockEmailHtml,
    });
  });
});
