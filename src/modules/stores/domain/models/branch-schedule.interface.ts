import { IBranches } from "./branches.interface";

export interface IBranchSchedule {
    id: number;
    branch: IBranches;
    day: string;
    open_time: string;
    close_time: string;
}