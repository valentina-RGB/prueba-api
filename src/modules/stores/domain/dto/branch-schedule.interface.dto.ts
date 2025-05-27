import { IBranches } from "../models/branches.interface";

export class IBranchScheduleCreateDto {
    branch?: IBranches;
    branch_id?: number;
    day: string;
    open_time: string;
    close_time: string;
}