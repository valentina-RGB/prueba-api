import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBranchAttributeDto } from '../../dto/branch-attribute/update-branch-attibute.dto';
import { IBranchAttribute } from 'src/modules/stores/domain/models/branch-attribute.interface';
import {
  IBranchAttributeRepository,
  IBranchAttributeRepositoryToken,
} from 'src/modules/stores/domain/repositories/branch-attributes.repository.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetAttributeByIdUseCase } from '../attributes/get-attribute-by-id.use-case';

@Injectable()
export class UpdateBranchAttributeUseCase
  implements
    IUseCase<
      {
        branchId: number;
        attributeId: number;
        data: UpdateBranchAttributeDto;
      },
      IBranchAttribute
    >
{
  constructor(
    @Inject(IBranchAttributeRepositoryToken)
    private readonly branchAttributeRepository: IBranchAttributeRepository,
    private readonly getAttribute: GetAttributeByIdUseCase,
  ) {}

  async execute({
    branchId,
    attributeId,
    data,
  }: {
    branchId: number;
    attributeId: number;
    data: UpdateBranchAttributeDto;
  }): Promise<IBranchAttribute> {
    if (!branchId || !attributeId) {
      throw new BadRequestException('Branch ID and Attribute ID are required');
    }

    const attribute = await this.getAttribute.execute(attributeId);

    if (attribute?.requires_response == false) {
      throw new BadRequestException(
        'It is not possible to edit the value because the attribute does not require it',
      );
    }

    const existingBranchAttribute =
      await this.branchAttributeRepository.findByBranchAndAttribute(
        branchId,
        attributeId,
      );

    if (!existingBranchAttribute) {
      throw new NotFoundException(
        `Branch attribute not found for branch ${branchId} and attribute ${attributeId}`,
      );
    }

    existingBranchAttribute.value = data.value;
    const updatedBranchAttribute = await this.branchAttributeRepository.update(
      existingBranchAttribute,
    );

    return updatedBranchAttribute;
  }
}
