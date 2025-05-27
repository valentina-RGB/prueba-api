import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IAttribute } from 'src/modules/stores/domain/models/attributes.interface';
import {
  IAttributeRepositoryToken,
  IAttributeRepository,
} from 'src/modules/stores/domain/repositories/attributes.repository.interface';

@Injectable()
export class ListAttributesUseCase implements IUseCase<void, IAttribute[]> {
  constructor(
    @Inject(IAttributeRepositoryToken)
    private readonly attributeRepository: IAttributeRepository,
  ) {}

  async execute(): Promise<any> {
    return await this.attributeRepository.findAll();
  }
}
