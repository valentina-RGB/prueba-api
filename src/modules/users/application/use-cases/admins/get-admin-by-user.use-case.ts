import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import {
  IAdminRepositoryToken,
  IAdminRepository,
} from 'src/modules/users/domain/repositories/admin.repository.interface';

@Injectable()
export class GetAdminByUserUseCase implements IUseCase<number, IAdministrator | null>
{
  constructor(
    @Inject(IAdminRepositoryToken)
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(id: number): Promise<IAdministrator | null> {
    const admin = await this.adminRepository.findByUserId(id);

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }
}
