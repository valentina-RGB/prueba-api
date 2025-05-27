import { Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import {
  IClientRepositoryToken,
  IClientRepository,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { CreatePeopleDto } from '../../dto/people/create-people-dto';
import { IUserCreateDto } from 'src/modules/users/domain/dto/user.dto.interface';
import { GetRoleByNameUseCase } from '../roles/get-role-by-name.use-case';
import { CreatePeopleUseCase } from '../people/create-people.use-case';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { Role } from '../../dto/enums/role.enum';
import { DataSource } from 'typeorm';
import { SendWelcomeEmailUseCase } from 'src/modules/mailer/application/use-cases/send-client-welcome-email.use-case';

export class CreateClientUseCase
  implements
    IUseCase<{ userData: IUserCreateDto; personData: CreatePeopleDto }, IClient>
{
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
    private readonly createPersonUseCase: CreatePeopleUseCase,
    private readonly getRoleByNameUseCase: GetRoleByNameUseCase,
    private readonly sendWelcomeClientUseCase: SendWelcomeEmailUseCase,
    private readonly dataSource: DataSource,
  ) {}

  async execute({
    userData,
    personData,
  }: {
    userData: CreateUserDto;
    personData: CreatePeopleDto;
  }): Promise<IClient> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      userData.role = await this.findRole(Role.CLIENT);

      const person = await this.createPersonUseCase.execute({
        userData,
        personData,
        queryRunner,
      });

      const clientRepo = this.clientRepository.withTransaction(
        queryRunner.manager,
      );

      const newClient = await clientRepo.createClient({ person });
      if (!newClient) throw new ConflictException('Client already exists');

      await queryRunner.commitTransaction();

      await this.sendWelcomeClientUseCase.execute(newClient);
      const client = await clientRepo.findById(newClient.id);
      return client!;
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
