import { Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IRole } from '../../../domain/models/role.interface';
import {
  IRoleRepositoryToken,
  IRoleRepository,
} from '../../../domain/repositories/role.repository.interface';

export class GetRoleUseCase implements IUseCase<number, IRole> {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(id: number): Promise<IRole> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
