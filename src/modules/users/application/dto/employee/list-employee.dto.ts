import { ApiProperty } from "@nestjs/swagger";
import { EmployeeResponseDto } from "./employee-response.dto";

export class ListEmployeeDto {
    @ApiProperty({ type: [EmployeeResponseDto], description: 'List of Employee' })
    employee: EmployeeResponseDto[];

    constructor(employee: any[]) {
        this.employee = employee.map((employee) => new EmployeeResponseDto(employee));
      }
}