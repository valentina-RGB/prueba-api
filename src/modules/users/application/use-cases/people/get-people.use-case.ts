import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPeople } from '../../../domain/models/people.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IPeopleRepositoryToken,
  IPeopleRepository,
} from '../../../domain/repositories/people.repository.interface';

@Injectable()
export class GetPeopleUseCase implements IUseCase<number, IPeople> {
  constructor(
    @Inject(IPeopleRepositoryToken)
    private readonly peopleRepository: IPeopleRepository,
  ) {}

  async execute(id: number): Promise<IPeople> {
    const people = await this.peopleRepository.findById(id);
    if (!people) {
      throw new NotFoundException('People not found');
    }
    return people;
  }
}
