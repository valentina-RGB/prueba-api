import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import {
  IAdminRepositoryToken,
  IAdminRepository,
} from 'src/modules/users/domain/repositories/admin.repository.interface';

@Injectable()
export class GetAdminUseCase implements IUseCase<number, IAdministrator> {
  constructor(
    @Inject(IAdminRepositoryToken)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(id: number): Promise<IAdministrator> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Administrator not found');
    }
    return admin;
  }
}
