import { PeopleResponseDto } from '../people/people-response.dto';

export class EmployeeResponseDto {
  id?: number;
  employee_type: string;
  person: any;
  branch: {
    address: string;
    name: string;
  };

  constructor(employee: any) {
    this.id = employee.id;
    this.employee_type = employee.employee_type;
    this.person = new PeopleResponseDto(employee.person);
    this.branch = {
      address: employee.branch?.address,
      name: employee.branch?.name,
    };
  }
}
