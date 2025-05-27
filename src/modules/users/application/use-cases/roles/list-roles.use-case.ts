import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IRole } from '../../../domain/models/role.interface';
import {
  IRoleRepositoryToken,
  IRoleRepository,
} from '../../../domain/repositories/role.repository.interface';

export class ListRolesUseCase implements IUseCase<void, IRole[]> {
  constructor(
    @Inject(IRoleRepositoryToken)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(): Promise<IRole[]> {
    return this.roleRepository.findAll();
  }
}
