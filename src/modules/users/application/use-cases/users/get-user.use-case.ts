import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import { IUser } from 'src/modules/users/domain/models/user.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class GetUserUseCase implements IUseCase<number, IUser> {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
