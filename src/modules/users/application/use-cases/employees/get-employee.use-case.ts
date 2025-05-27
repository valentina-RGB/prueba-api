import { Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEmployee } from '../../../domain/models/employe.interface';
import {
  IEmployeeRepositoryToken,
  IEmployeeRepository,
} from '../../../domain/repositories/employe.repository.interface';

export class GetEmployeeUseCase implements IUseCase<number, IEmployee> {
  constructor(
    @Inject(IEmployeeRepositoryToken)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: number): Promise<IEmployee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }
}
