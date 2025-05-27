import { Inject } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import {
  IAdminRepositoryToken,
  IAdminRepository,
} from 'src/modules/users/domain/repositories/admin.repository.interface';

export class ListAdminsUseCase implements IUseCase<void, IAdministrator[]> {
  constructor(
    @Inject(IAdminRepositoryToken)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(): Promise<IAdministrator[]> {
    return await this.adminRepository.findAll();
  }
}
