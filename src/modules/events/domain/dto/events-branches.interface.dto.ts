import { IBranches } from 'src/modules/stores/domain/models/branches.interface';
import { IEvent } from '../models/events.interface';

export interface ICreateEventBranch {
  event: IEvent;
  branch: IBranches;
}
