import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IEmployee } from '../../../domain/models/employe.interface';
import {
  IEmployeeRepository,
  IEmployeeRepositoryToken,
} from '../../../domain/repositories/employe.repository.interface';
import { CreateEmployeeDto } from '../../dto/employee/create-employee.dto';
import { GetBranchUseCase } from 'src/modules/stores/application/use-cases/branches/get-branch.use-case';
import { CreatePeopleDto } from '../../dto/people/create-people-dto';
import { CreatePeopleUseCase } from '../people/create-people.use-case';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { Role } from '../../dto/enums/role.enum';
import { GetRoleByNameUseCase } from '../roles/get-role-by-name.use-case';
import { DataSource } from 'typeorm';

export class CreateEmployeeUseCase
  implements
    IUseCase<
      {
        userData: CreateUserDto;
        personData: CreatePeopleDto;
        employeeData: CreateEmployeeDto;
      },
      IEmployee
    >
{
  constructor(
    @Inject(IEmployeeRepositoryToken)
    private readonly employeeRepository: IEmployeeRepository,
    private readonly createPersonUseCase: CreatePeopleUseCase,
    private readonly getBranchUseCase: GetBranchUseCase,
    private readonly getRoleByNameUseCase: GetRoleByNameUseCase,

    private readonly dataSource: DataSource,
  ) {}

  async execute({
    userData,
    personData,
    employeeData,
  }: {
    userData: CreateUserDto;
    personData: CreatePeopleDto;
    employeeData: CreateEmployeeDto;
  }): Promise<IEmployee> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const branch = await this.getBranchUseCase.execute(
        employeeData.branch_id!,
      );
      if (!branch) throw new NotFoundException('Branch not found');

      const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
      userData.password = randomPassword;

      userData.role = await this.findRole(Role.EMPLOYEE);
      const person = await this.createPersonUseCase.execute({
        userData,
        personData,
        queryRunner,
      });

      const employeeRepo = this.employeeRepository.withTransaction(
        queryRunner.manager,
      );

      const newEmployee = await employeeRepo.createEmployee({
        ...employeeData,
        person: person,
        branch: branch,
      });

      if (!newEmployee) throw new ConflictException('Failed to create employee');
      
      await queryRunner.commitTransaction();
      return newEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findRole(roleName: string) {
    const role = await this.getRoleByNameUseCase.execute(roleName);
    if (!role) throw new NotFoundException(`Role ${roleName} not found`);
    return role;
  }
}
