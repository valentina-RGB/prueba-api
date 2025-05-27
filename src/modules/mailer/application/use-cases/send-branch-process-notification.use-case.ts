import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { NodemailerService } from '../../infrastructure/external-services/nodemailer.service';
import { TemplateService } from '../../infrastructure/external-services/template.service';

@Injectable()
export class SendBranchProcessNotificationUseCase
  implements IUseCase<IBranches, void>
{
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService,
  ) {}

  async execute(branch: IBranches) {
    const templateContext = {
      storeName: branch.store.name,
      branchName: branch.name,
      branchAddress: branch.address,
    };

    const htmlContent = this.templateService.loadTemplate(
      'branch-process-notification',
      templateContext,
    );

    const emailHtml = this.nodemailerService.createEmailTemplate(
      htmlContent,
      'Recibimos tu solicitud de registro',
    );

    await this.nodemailerService.sendEmail({
      to: branch.store.email,
      subject: 'Tu sucursal está en revisión',
      html: emailHtml,
    });
  }
}
