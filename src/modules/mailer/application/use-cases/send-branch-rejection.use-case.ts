import { Injectable } from "@nestjs/common";
import { NodemailerService } from "../../infrastructure/external-services/nodemailer.service";
import { TemplateService } from "../../infrastructure/external-services/template.service";
import { IBranches } from "src/modules/stores/domain/models/branches.interface";

@Injectable()
export class SendStoreRejectionEmailUseCase {
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService
  ) {}

  async execute(branch: IBranches, comments: string) {
    const templateContext = {
      storeName: branch.store.name,
      storeId: branch.store.id,
      branchName: branch.name,
      rejectionReason: comments
    };

    const htmlContent = this.templateService.loadTemplate('store-rejection', templateContext);
    const emailHtml = this.nodemailerService.createEmailTemplate(
      htmlContent, 
      'Solicitud de Tienda No Aprobada'
    );

    await this.nodemailerService.sendEmail({
      to: branch.store.email,
      subject: 'Store Rejection Notification',
      html: emailHtml
    });
  }
}