import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAttribute } from 'src/modules/stores/domain/models/attributes.interface';
import {
  IAttributeRepositoryToken,
  IAttributeRepository,
} from 'src/modules/stores/domain/repositories/attributes.repository.interface';

@Injectable()
export class GetAttributeByIdUseCase
  implements IUseCase<number, IAttribute | null>
{
  constructor(
    @Inject(IAttributeRepositoryToken)
    private readonly repository: IAttributeRepository,
  ) {}

  async execute(id: number): Promise<IAttribute | null> {
    const attribute = await this.repository.findById(id);
    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }
    return attribute;
  }
}
