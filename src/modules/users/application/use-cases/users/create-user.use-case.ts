import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import {
  IPasswordHasherService,
  IPasswordHasherServiceToken,
} from '../../../domain/external-services/password-hasher.interface.service';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { QueryRunner } from 'typeorm';

@Injectable()
export class CreateUserUseCase
  implements
    IUseCase<{ userData: CreateUserDto; queryRunner?: QueryRunner }, IUser>
{
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,

    @Inject(IPasswordHasherServiceToken)
    private readonly passwordHasher: IPasswordHasherService,
  ) {}

  async execute({
    userData,
    queryRunner,
  }: {
    userData: CreateUserDto;
    queryRunner?: QueryRunner;
  }): Promise<IUser> {
    const userRepo = queryRunner
      ? this.userRepository.withTransaction(queryRunner.manager)
      : this.userRepository;

    const existingUser = await userRepo.findByEmail(userData.email!);
    if (existingUser) throw new ConflictException('Email already exists');

    userData.password = await this.passwordHasher.hash(userData.password!);
    const newUser = await userRepo.create(userData);

    return newUser;
  }
}
