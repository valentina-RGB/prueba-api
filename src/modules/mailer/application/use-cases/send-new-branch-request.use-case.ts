import { Injectable } from '@nestjs/common';
import { NodemailerService } from '../../infrastructure/external-services/nodemailer.service';
import { TemplateService } from '../../infrastructure/external-services/template.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendNewStoreRequestEmailUseCase {
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    branch: any,
    adminEmails: string[],
    adminNames: string[],
  ): Promise<void> {
    const urlBase = this.configService.get<string>('FRONTEND_URL');

    for (let i = 0; i < adminEmails.length; i++) {
      const templateContext = {
        adminName: adminNames[i],
        branchName: branch.name,
        branchAddress: branch.address,
        branchPhone: branch.phone_number,
        storeEmail: branch.store.email,
        storeName: branch.store.name,
        urlBase: urlBase,
      };

      const htmlContent = this.templateService.loadTemplate(
        'new-store-request',
        templateContext,
      );

      const emailHtml = this.nodemailerService.createEmailTemplate(
        htmlContent,
        'Solicitud de Revisión de Nueva Tienda',
      );

      await this.nodemailerService.sendEmail({
        to: adminEmails[i],
        subject: 'Solicitud de Revisión de Nueva Tienda',
        html: emailHtml,
      });
    }
  }
}
