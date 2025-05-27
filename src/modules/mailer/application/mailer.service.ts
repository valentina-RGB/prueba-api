import { Injectable } from '@nestjs/common';
import { SendWelcomeEmailUseCase } from './use-cases/send-client-welcome-email.use-case';
import { SendStoreApprovedEmailUseCase } from './use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from './use-cases/send-branch-rejection.use-case';
import { SendNewStoreRequestEmailUseCase } from './use-cases/send-new-branch-request.use-case';
import { IMailerService } from '../domain/services/mailer.service.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { SendBranchProcessNotificationUseCase } from './use-cases/send-branch-process-notification.use-case';

@Injectable()
export class MailerService implements IMailerService {
  constructor(
    private readonly sendNewStoreRequestEmailUseCase: SendNewStoreRequestEmailUseCase,
    private readonly sendStoreApprovedEmailUseCase: SendStoreApprovedEmailUseCase,
    private readonly sendStoreRejectionEmailUseCase: SendStoreRejectionEmailUseCase,
    private readonly sendBranchProcessNotificationEmailUseCase: SendBranchProcessNotificationUseCase,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
  ) {}

  async sendNewStoreRequest(store, adminEmails, adminNames) {
    await this.sendNewStoreRequestEmailUseCase.execute(
      store,
      adminEmails,
      adminNames,
    );
  }

  async sendStoreApproved(branch: IBranches) {
    await this.sendStoreApprovedEmailUseCase.execute(branch);
  }

  async sendStoreRejected(branch: IBranches, comments: string) {
    await this.sendStoreRejectionEmailUseCase.execute(branch, comments);
  }

  async sendWelcomeEmail(user) {
    await this.sendWelcomeEmailUseCase.execute(user);
  }

  async sendBranchProcessNotification(branch: IBranches) {
    await this.sendBranchProcessNotificationEmailUseCase.execute(branch);
  }
}
