import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEmployee } from '../../../domain/models/employe.interface';
import {
  IEmployeeRepositoryToken,
  IEmployeeRepository,
} from '../../../domain/repositories/employe.repository.interface';

export class ListEmployeesUseCase implements IUseCase<void, IEmployee[]> {
  constructor(
    @Inject(IEmployeeRepositoryToken)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(): Promise<IEmployee[]> {
    return this.employeeRepository.findAll();
  }
}
