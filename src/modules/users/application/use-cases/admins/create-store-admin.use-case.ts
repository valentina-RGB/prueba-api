import { BadRequestException, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IPersonCreateDto } from 'src/modules/users/domain/dto/person.dto.interface';
import { IUserCreateDto } from 'src/modules/users/domain/dto/user.dto.interface';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import { CreatePeopleUseCase } from '../people/create-people.use-case';
import {
  IAdminRepository,
  IAdminRepositoryToken,
} from 'src/modules/users/domain/repositories/admin.repository.interface';
import { GetStoreUseCase } from 'src/modules/stores/application/use-cases/stores/get-store.use-case';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetRoleByNameUseCase } from '../roles/get-role-by-name.use-case';
import { Role } from '../../dto/enums/role.enum';
import { DataSource } from 'typeorm';

export class RegisterStoreAdminUseCase
  implements
    IUseCase<
      {
        storeData: { id: number };
        userData: IUserCreateDto;
        personData: IPersonCreateDto;
      },
      IAdministrator
    >
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly findStoreUseCase: GetStoreUseCase,
    private readonly createPersonUseCase: CreatePeopleUseCase,
    private readonly getRoleByNameUseCase: GetRoleByNameUseCase,

    @Inject(IAdminRepositoryToken)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute({ storeData, userData, personData }): Promise<IAdministrator> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storeExists = await this.findStoreUseCase.execute(storeData.id);
      if (!storeExists) throw new BadRequestException(`Store does not exist`);

      const role = await this.findRole(Role.ADMIN_STORE);
      userData.role = role;

      const person = await this.createPersonUseCase.execute({
        userData,
        personData,
        queryRunner
      });

      const adminData = {
        admin_type: 'STORE',
        entity_id: storeData.id,
        person,
      };

      const adminRepo = this.adminRepository.withTransaction(
        queryRunner.manager,
      );
      const admin = await adminRepo.create(adminData);

      await queryRunner.commitTransaction();

      return await adminRepo.findById(admin.id);
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
