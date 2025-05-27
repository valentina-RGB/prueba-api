import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import { IUser } from '../../../domain/models/user.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class ListUserUseCase implements IUseCase<void, any[]> {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<any[]> {
    return this.userRepository.findAll();
  }
}
