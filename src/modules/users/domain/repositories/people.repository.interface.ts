import { EntityManager } from 'typeorm';
import {
  IPersonCreateDto,
  IPersonUpdateDto,
} from '../dto/person.dto.interface';
import { IPeople } from '../models/people.interface';

export interface IPeopleRepository {
  createPeople(person: IPersonCreateDto): Promise<IPeople>;
  updatePeople(id: number, PersonData: IPersonUpdateDto): Promise<void>;
  findById(id: number): Promise<IPeople | null>;
  findAll(): Promise<IPeople[]>;
  findByIdentification(number_document: string): Promise<IPeople | null>;
  withTransaction(manager: EntityManager): IPeopleRepository;
}

export const IPeopleRepositoryToken = Symbol('IPeopleRepository');
