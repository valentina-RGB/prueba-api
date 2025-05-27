import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/modules/users/domain/repositories/user.repository.interface';
import { IUser } from '../../../domain/models/user.interface';

@Injectable()
export class GetUserByEmailUseCase implements IUseCase<string, IUser | null> {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }
}
