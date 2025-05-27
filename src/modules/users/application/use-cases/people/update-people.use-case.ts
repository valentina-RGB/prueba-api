import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePersonDto } from '../../dto/people/update-people.dto';
import { IPeople } from '../../../domain/models/people.interface';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import {
  IPeopleRepositoryToken,
  IPeopleRepository,
} from '../../../domain/repositories/people.repository.interface';
import { GetUserByEmailUseCase } from '../users/get-by-email-user.use-case';
import { UpdateUserUseCase } from '../users/update-user.use-case';

@Injectable()
export class UpdatePeopleUseCase
  implements IUseCase<{ id: number; data: UpdatePersonDto }, IPeople | null>
{
  constructor(
    @Inject(IPeopleRepositoryToken)
    private readonly peopleRepository: IPeopleRepository,
    private readonly getUser: GetUserByEmailUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  async execute({id,data }: {id: number; data: UpdatePersonDto;}): Promise<IPeople | null> {
    const people = await this.peopleRepository.findById(id);
    if (!people) throw new NotFoundException('People not found');

    if (data.number_document) {
      const existingPerson = await this.peopleRepository.findByIdentification(
        data.number_document,
      );
      if (existingPerson)
        throw new ConflictException('Document number already exists');
    }

    const userId = people.user!.id;

    if (data.email) {
      const existingUser = await this.getUser.execute(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already exists');
      }
    }

    if (data.email || data.password) {
      await this.updateUser.execute({
        id: userId,
        data: {
          ...(data.email && { email: data.email }),
          ...(data.password && { password: data.password }),
        },
      });
    }

    if(!data.email && !data.password) await this.peopleRepository.updatePeople(id, data);

    return this.peopleRepository.findById(id);
  }
}
