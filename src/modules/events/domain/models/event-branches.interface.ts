import { IBranches } from "src/modules/stores/domain/models/branches.interface";

export interface IEventBranches {
    id: number;
    branch: IBranches;
    // event: IEvent; 
}