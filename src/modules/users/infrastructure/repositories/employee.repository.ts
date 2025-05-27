import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { EmployeEntity } from '../entities/employe.entity';
import { IEmployeeRepository } from '../../domain/repositories/employe.repository.interface';
import { IEmployee } from '../../domain/models/employe.interface';
import { IEmployeeCreateDto } from '../../domain/dto/employe.dto.interface';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(EmployeEntity)
    private readonly employeeEntityRepository: Repository<EmployeEntity>,
  ) {}

  async createEmployee(employee: IEmployeeCreateDto): Promise<IEmployee> {
    try {
      return await this.employeeEntityRepository.save(
        employee as DeepPartial<EmployeEntity>,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async findById(id: number): Promise<IEmployee | null> {
    return await this.employeeEntityRepository.findOne({
      where: { id },
      relations: ['person', 'person.user', 'branch'],
    });
  }

  async findAll(): Promise<IEmployee[]> {
    return await this.employeeEntityRepository.find({
      relations: ['person', 'person.user', 'branch'],
    });
  }

  async findByPersonId(id: number): Promise<IEmployee | null> {
    return await this.employeeEntityRepository.findOne({
      where: { person: { id } },
      relations: ['person', 'person.user', 'branch'],
    });
  }

  withTransaction(manager: EntityManager): IEmployeeRepository {
    return new EmployeeRepository(manager.getRepository(EmployeEntity));
  }
}
