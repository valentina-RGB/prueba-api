import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';

@Injectable()
export class DeleteUserUseCase implements IUseCase<number, void> {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.delete(id);
  }
}
