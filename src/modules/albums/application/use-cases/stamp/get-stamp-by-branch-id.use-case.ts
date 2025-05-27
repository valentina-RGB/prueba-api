import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IStamps } from "src/modules/albums/domain/models/stamps.interface";
import { IStampRepositoryToken } from "src/modules/albums/domain/repositories/stamp.repository.interface";
import { StampRepository } from "src/modules/albums/infrastructure/repositories/stamp.repository";


@Injectable()
export class GetStampByBranch implements IUseCase <number, IStamps | null>{
    constructor(
        @Inject(IStampRepositoryToken)
        private readonly stamRepository: StampRepository
    ){}

    async execute(branch_id: number): Promise < IStamps | null>{
        if (!branch_id || isNaN(branch_id)) {
           throw new NotFoundException("Invalid branch ID");
        }

        const stamp= await this.stamRepository.ListStampByIdBranch(branch_id)

        return stamp || null;
    }
}