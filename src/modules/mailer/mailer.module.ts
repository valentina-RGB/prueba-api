import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './application/mailer.service';
import { SendWelcomeEmailUseCase } from './application/use-cases/send-client-welcome-email.use-case';
import { NodemailerService } from './infrastructure/external-services/nodemailer.service';
import { TemplateService } from './infrastructure/external-services/template.service';
import { SendStoreApprovedEmailUseCase } from './application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from './application/use-cases/send-branch-rejection.use-case';
import { SendNewStoreRequestEmailUseCase } from './application/use-cases/send-new-branch-request.use-case';
import { MockNodemailerService } from './infrastructure/external-services/mock-nodemailer.service';
import { SendBranchProcessNotificationUseCase } from './application/use-cases/send-branch-process-notification.use-case';
import { SendBranchInscriptionToEventUseCase } from './application/use-cases/send-branch-inscription-to-event.use-case';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NodemailerService,
      useFactory: (configService: ConfigService) => {
        const isTestEnv = process.env.NODE_ENV === 'test';

        if (isTestEnv) {
          return new MockNodemailerService(configService);
        } else {
          return new NodemailerService(configService);
        }
      },
      inject: [ConfigService],
    },
    TemplateService,
    MailerService,
    SendWelcomeEmailUseCase,
    SendNewStoreRequestEmailUseCase,
    SendStoreApprovedEmailUseCase,
    SendStoreRejectionEmailUseCase,
    SendBranchProcessNotificationUseCase,
    SendBranchInscriptionToEventUseCase,
  ],
  exports: [
    MailerService,
    SendWelcomeEmailUseCase,
    SendNewStoreRequestEmailUseCase,
    SendStoreApprovedEmailUseCase,
    SendStoreRejectionEmailUseCase,
    SendBranchProcessNotificationUseCase,
    SendBranchInscriptionToEventUseCase,
  ],
})
export class MailerModule {}
