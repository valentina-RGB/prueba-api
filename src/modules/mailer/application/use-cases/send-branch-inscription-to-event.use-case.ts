import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { NodemailerService } from '../../infrastructure/external-services/nodemailer.service';
import { TemplateService } from '../../infrastructure/external-services/template.service';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IEvent } from 'src/modules/events/domain/models/events.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendBranchInscriptionToEventUseCase
  implements IUseCase<{ event: IEvent; branch: IBranches }, void>
{
  constructor(
    private readonly nodemailerService: NodemailerService,
    private readonly templateService: TemplateService,
  ) {}

  async execute({ event, branch }: { event: IEvent; branch: IBranches }) {
    const templateContext = {
      branchName: branch.name,
      eventName: event.name,
      eventLink: `https://example.com/events/${branch.id}`,
    };

    const htmlContent = this.templateService.loadTemplate(
      'branch-inscription-to-event',
      templateContext,
    );

    const emailHtml = this.nodemailerService.createEmailTemplate(
      htmlContent,
       `¡Estás dentro del evento ${event.name}!`,
    );

    await this.nodemailerService.sendEmail({
      to: branch.store.email,
      subject: '¡Tu cafetería ha sido inscrita en un nuevo evento!',
      html: emailHtml,
    });
  }
}
