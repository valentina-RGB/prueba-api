import { Inject, NotFoundException } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IImage } from "src/modules/stores/domain/models/images.interface";
import { IImageRepository, IImageRepositoryToken } from "src/modules/stores/domain/repositories/image.repository.interface";
import { GetBranchUseCase } from "../branches/get-branch.use-case";

export class GetImageByBranchIdUseCase implements IUseCase<number, IImage[]> {
  constructor(
    @Inject(IImageRepositoryToken)
    private readonly imageRepository: IImageRepository,
    private readonly getBranchById: GetBranchUseCase,
) {}

  async execute(branchId: number): Promise<IImage[] > {
    const branch = await this.getBranchById.execute(branchId);
        if (!branch) throw new NotFoundException('Branch not found');

    const images = await this.imageRepository.GetImageByBranchId(branchId); 

    return images || [];
  }
}