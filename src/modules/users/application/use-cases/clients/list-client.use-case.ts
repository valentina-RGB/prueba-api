import { Injectable, Inject } from "@nestjs/common";
import { IUseCase } from "src/core/domain/interfaces/use-cases/use-case.interface";
import { IClient } from "src/modules/users/domain/models/client.interface";
import { IClientRepositoryToken, IClientRepository } from "src/modules/users/domain/repositories/client.repository.interface";

@Injectable()
export class ListClientUseCase implements IUseCase<void, IClient[]> {
  constructor(
    @Inject(IClientRepositoryToken)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(): Promise<IClient[]> {
    return await this.clientRepository.findAll();
  }
}
