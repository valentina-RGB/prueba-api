import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IBranchAttribute } from 'src/modules/stores/domain/models/branch-attribute.interface';
import {
  IBranchAttributeRepository,
  IBranchAttributeRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { GetBranchUseCase } from '../branches/get-branch.use-case';
import { CreateBranchAttributeDto } from '../../dto/branch-attribute/create-branch-attribute.dto';
import { GetAttributeByIdUseCase } from '../attributes/get-attribute-by-id.use-case';

@Injectable()
export class CreateBranchAttributeUseCase {
  constructor(
    @Inject(IBranchAttributeRepositoryToken)
    private readonly repository: IBranchAttributeRepository,
    private readonly getBranchByIdUseCase: GetBranchUseCase,
    private readonly getAttributeByIdUseCase: GetAttributeByIdUseCase,
  ) {}

  async execute(data: CreateBranchAttributeDto): Promise<IBranchAttribute[]> {
    const createdAttributes: IBranchAttribute[] = [];

    const branch = await this.getBranchByIdUseCase.execute(data.branchId);
    if (!branch)
      throw new NotFoundException(`Branch with ID ${data.branchId} not found`);

    for (const attr of data.attributes) {
      const attribute = await this.getAttributeByIdUseCase.execute(attr.attributeId);
      if (!attribute) 
        throw new NotFoundException(`Attribute with ID ${attr.attributeId} not found`);
      
      const created: IBranchAttribute = await this.repository.create({
        branch,
        attribute,
        value: attr.value,
      });

      createdAttributes.push(created);
    }

    return createdAttributes;
  }
}
