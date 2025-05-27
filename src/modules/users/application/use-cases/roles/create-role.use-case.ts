import { Inject, ConflictException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IRole } from '../../../domain/models/role.interface';

import {
  IRoleRepositoryToken,
  IRoleRepository,
} from '../../../domain/repositories/role.repository.interface';
import { CreateRoleDto } from '../../dto/roles/create-role.dto';

export class CreateRoleUseCase implements IUseCase<CreateRoleDto, IRole> {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(roleData: CreateRoleDto): Promise<IRole> {
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole) throw new ConflictException('Role already exists');

    const newRole = await this.roleRepository.create(roleData);

    return newRole;
  }
}
