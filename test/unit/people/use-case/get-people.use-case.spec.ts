import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetPeopleUseCase } from 'src/modules/users/application/use-cases/people/get-people.use-case';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from 'src/modules/users/domain/repositories/people.repository.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

describe('GetPeopleUseCase', () => {
  let getPeopleUseCase: GetPeopleUseCase;
  let peopleRepository: IPeopleRepository;

  beforeEach(async () => {
    const mockPeopleRepository = {
      findById: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetPeopleUseCase,
        {
          provide: IPeopleRepositoryToken,
          useValue: mockPeopleRepository,
        },
      ],
    }).compile();

    getPeopleUseCase = moduleFixture.get<GetPeopleUseCase>(GetPeopleUseCase);
    peopleRepository = moduleFixture.get<IPeopleRepository>(
      IPeopleRepositoryToken,
    );
  });

  it('should get a person by ID successfully', async () => {
    const person: IPeople = {
      id: 1,
      user: { id: 1, email: 'jane.doe@example.com', status: true, role: { id: 2, name: 'Client', status: true } },
      type_document: 'ID',
      number_document: '123456',
      full_name: 'Jane Doe',
      phone_number: '987-654-3210',
    };

    jest.spyOn(peopleRepository, 'findById').mockResolvedValue(person);

    const result = await getPeopleUseCase.execute(1);

    expect(result).toEqual(person);
    expect(peopleRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an error if the person does not exist', async () => {
    jest.spyOn(peopleRepository, 'findById').mockResolvedValue(null);

    await expect(getPeopleUseCase.execute(16)).rejects.toThrow(
      new NotFoundException('People not found'),
    );
  });
});
