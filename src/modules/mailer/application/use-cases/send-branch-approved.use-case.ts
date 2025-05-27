import { Injectable } from '@nestjs/common';
import { NodemailerService } from '../../infrastructure/external-services/nodemailer.service';
import { TemplateService } from '../../infrastructure/external-services/template.service';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendStoreApprovedEmailUseCase {
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
  ) {}

  async execute(branch: IBranches) {
    const urlBase = this.configService.get<string>('FRONTEND_URL');
    const templateContext = {
      storeName: branch.store.name,
      storeId: branch.store.id,
      branchName: branch.name,
      branchAddress: branch.address,
      urlBase: urlBase,
    };

    const htmlContent = this.templateService.loadTemplate(
      'store-approved',
      templateContext,
    );
    const emailHtml = this.nodemailerService.createEmailTemplate(
      htmlContent,
      'Bienvenido a Encafeinados',
    );

    await this.nodemailerService.sendEmail({
      to: branch.store.email,
      subject: 'Welcome to Encafeinados!',
      html: emailHtml,
    });
  }
}
