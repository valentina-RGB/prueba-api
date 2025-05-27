import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IStore } from 'src/modules/stores/domain/models/store.interface';

export interface IMailerService {
  sendNewStoreRequest(
    store: IStore,
    adminEmails: string,
    adminNames,
  ): Promise<void>;
  sendStoreApproved(branch: IBranches): Promise<void>;
  sendStoreRejected(branch: IBranches, reason: string): Promise<void>;
  sendWelcomeEmail(store: IStore): Promise<void>;
  sendBranchProcessNotification(branch: IBranches): Promise<void>;
}
