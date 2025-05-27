export class ResponseBranchScheduleDto {
    id: string;
    day: string;
    open_time: string;
    close_time: string;

    constructor(branch:any) {
        this.id = branch.id;
        this.day = branch.day;
        this.open_time = branch.open_time;
        this.close_time = branch.close_time;
    }
}