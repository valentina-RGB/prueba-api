import { ApiProperty } from "@nestjs/swagger";
import { IBranchScheduleCreateDto } from "src/modules/stores/domain/dto/branch-schedule.interface.dto";

export class CreateBranchScheduleDto implements IBranchScheduleCreateDto{
    
    @ApiProperty({example: 1, description: 'Branch ID associated with the schedule'})
    branch_id: number;

    @ApiProperty({example: 'Monday', description: 'Day of the week'})
    day: string;

    @ApiProperty({example: '08:00', description: 'Opening time of the branch'})
    open_time: string;

    @ApiProperty({example: '17:00', description: 'Closing time of the branch'})
    close_time: string;
}