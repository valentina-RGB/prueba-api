import { Injectable } from '@nestjs/common';
import { TemplateService } from '../../infrastructure/external-services/template.service';
import { NodemailerService } from '../../infrastructure/external-services/nodemailer.service';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService,
  ) {}

  async execute(client: any) {
    const templateContext = {
      clientName: client.person.full_name,
    };

    const htmlContent = this.templateService.loadTemplate(
      'welcome-client',
      templateContext,
    );
    const emailHtml = this.nodemailerService.createEmailTemplate(
      htmlContent,
      'Bienvenido a Nuestra Plataforma',
    );

    await this.nodemailerService.sendEmail({
      to: client.person.user.email,
      subject:
        '¡Te damos la Bienvenida a Encafeinados.Club, tu nueva comunidad de CoffeeLovers! ☕🌱',
      html: emailHtml,
    });
  }
}
