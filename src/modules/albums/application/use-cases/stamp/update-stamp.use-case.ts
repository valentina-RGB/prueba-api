import { Inject, Injectable } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IStamps } from "src/modules/albums/domain/models/stamps.interface";
import { IStampRepositoryToken, IStampRepository } from "src/modules/albums/domain/repositories/stamp.repository.interface";
import { UpdateStampDto } from "../../dto/stamp/update-stamp.dto";

@Injectable()
export class UpdateStampUseCase implements IUseCase<{ id: number; data: UpdateStampDto }, IStamps> {
  constructor(
    @Inject(IStampRepositoryToken)
    private readonly stampRepository: IStampRepository,
  ) {}

  async execute({ id, data }: { id: number; data: UpdateStampDto }): Promise<IStamps> {
    const stamp = await this.stampRepository.findById(id);
    if (!stamp) throw new Error("Stamp not found");

    return await this.stampRepository.update(id, data);
  }
}