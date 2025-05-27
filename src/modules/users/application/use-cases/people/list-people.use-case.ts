import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { IPeople } from '../../../domain/models/people.interface';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from '../../../domain/repositories/people.repository.interface';

@Injectable()
export class ListPeopleUseCase implements IUseCase<void, IPeople[]> {
  constructor(
    @Inject(IPeopleRepositoryToken)
    private readonly peopleRepository: IPeopleRepository,
  ) {}

  async execute(): Promise<IPeople[]> {
    return await this.peopleRepository.findAll();
  }
}
