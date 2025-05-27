import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/repositories/user.repository.interface';
import {
  IPasswordHasherServiceToken,
  IPasswordHasherService,
} from '../../../domain/external-services/password-hasher.interface.service';
import { UpdateUserDto } from '../../dto/users/update-user.dto';
import { IUser } from '../../../domain/models/user.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetRoleUseCase } from 'src/modules/users/application/use-cases/roles/get-role.use-case';

@Injectable()
export class UpdateUserUseCase
  implements IUseCase<{ id: number; data: UpdateUserDto }, IUser | null>
{
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,

    @Inject(IPasswordHasherServiceToken)
    private readonly passwordHasher: IPasswordHasherService,

    private readonly getRoleUseCase: GetRoleUseCase,
  ) {}

  async execute({
    id,
    data,
  }: {
    id: number;
    data: UpdateUserDto;
  }): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (data.password) {
      data.password = await this.passwordHasher.hash(data.password);
    }

    if (data.role_id) await this.getRoleUseCase.execute(data.role_id);
    
    await this.userRepository.update(id, data);

    return this.userRepository.findById(id);
  }
}
