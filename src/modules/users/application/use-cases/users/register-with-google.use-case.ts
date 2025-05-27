import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

import { QueryRunner } from 'typeorm';

@Injectable()
export class RegisterWithGoogleUseCase
  implements
    IUseCase<{ userData: CreateUserDto; queryRunner?: QueryRunner }, IUser>
{
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
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

    const newUser = await userRepo.create({
      ...userData,
      password: undefined,
    });

    return newUser;
  }
}
