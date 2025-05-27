import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IPeople } from '../../../domain/models/people.interface';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from '../../../domain/repositories/people.repository.interface';
import { CreatePeopleDto } from '../../dto/people/create-people-dto';
import { IUserCreateDto } from 'src/modules/users/domain/dto/user.dto.interface';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { RegisterWithGoogleUseCase } from '../users/register-with-google.use-case';
import { CreateUserUseCase } from '../users/create-user.use-case';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { QueryRunner } from 'typeorm';

export class CreatePeopleUseCase
  implements
    IUseCase<
      {
        userData: CreateUserDto;
        personData: CreatePeopleDto;
        queryRunner?: QueryRunner;
      },
      IPeople
    >
{
  constructor(
    @Inject(IPeopleRepositoryToken)
    private readonly peopleRepository: IPeopleRepository,
    private readonly createUserWithGoogleUseCase: RegisterWithGoogleUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute({
    userData,
    personData,
    queryRunner,
  }: {
    userData: CreateUserDto;
    personData: CreatePeopleDto;
    queryRunner?: QueryRunner;
  }): Promise<IPeople> {
    const peopleRepo = queryRunner
      ? this.peopleRepository.withTransaction(queryRunner.manager)
      : this.peopleRepository;

    const existingPerson = await peopleRepo.findByIdentification(personData.number_document);
    if (existingPerson)
      throw new ConflictException(
        `The number ${personData.number_document} is already registered`,
      );

    const user = await this.registerUser(userData, queryRunner);

    personData.user = user!;

    const newPeople = await peopleRepo.createPeople(personData);

    if (!newPeople) throw new ConflictException('People already exists');

    return newPeople;
  }

  private async registerUser(
    userData: IUserCreateDto,
    queryRunner?: QueryRunner,
  ): Promise<IUser> {
    if (userData.id_google)
      return this.createUserWithGoogleUseCase.execute({
        userData,
        queryRunner,
      });

    if (userData.password)
      return this.createUserUseCase.execute({ userData, queryRunner });

    throw new BadRequestException('Invalid registration method');
  }
}
