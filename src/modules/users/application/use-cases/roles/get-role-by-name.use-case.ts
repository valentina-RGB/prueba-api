import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IRole } from 'src/modules/users/domain/models/role.interface';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from 'src/modules/users/domain/repositories/role.repository.interface';

export class GetRoleByNameUseCase implements IUseCase<string, IRole | null> {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(name: string): Promise<IRole | null> {
    const role = await this.roleRepository.findByName(name);
    if (!role) throw new Error('Role not found');

    return role;
  }
}
