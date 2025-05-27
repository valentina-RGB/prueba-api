import { ICreateBranchAttribute} from '../dto/branches-attributes.interface.dto';
import { IBranchAttribute } from '../models/branch-attribute.interface';

export interface IBranchAttributeRepository {
  findAll(): Promise<IBranchAttribute[]>;
  findAllByBranch(branchId: number): Promise<IBranchAttribute[]>;
  findById(id: number): Promise<IBranchAttribute | null>;
  create(data: ICreateBranchAttribute): Promise<IBranchAttribute>;
  update(data: Partial<IBranchAttribute>): Promise<IBranchAttribute>;
  findByBranchAndAttribute(
    branchId: number,
    attributeId: number,
  ): Promise<IBranchAttribute | null>;
}

export const IBranchAttributeRepositoryToken = Symbol('IBranchAttributeRepository');
