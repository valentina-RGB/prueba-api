import { Test } from '@nestjs/testing';
import { ListPeopleUseCase } from 'src/modules/users/application/use-cases/people/list-people.use-case';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from 'src/modules/users/domain/repositories/people.repository.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

describe('ListPeopleUseCase', () => {
  let listPeopleUseCase: ListPeopleUseCase;
  let peopleRepository: IPeopleRepository;

  beforeEach(async () => {
    const mockPeopleRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        ListPeopleUseCase,
        {
          provide: IPeopleRepositoryToken,
          useValue: mockPeopleRepository,
        },
      ],
    }).compile();

    listPeopleUseCase = moduleFixture.get<ListPeopleUseCase>(ListPeopleUseCase);
    peopleRepository = moduleFixture.get<IPeopleRepository>(
      IPeopleRepositoryToken,
    );
  });

  it('should return all people successfully', async () => {
    const mockPeople: IPeople[] = [
      {
        id: 1,
        user: { id: 1, email: 'jane.doe@example.com', status: true, role: { id: 2, name: 'Client', status: true } },
        type_document: 'CC',
        number_document: '123456',
        full_name: 'Jane Doe',
        phone_number: '987-654-3210',
      },
      {
        id: 2,
        user: { id: 2, email: 'john.doe@example.com', status: true, role: { id: 1, name: 'Admin', status: true } },
        type_document: 'Passport',
        number_document: 'A1234567',
        full_name: 'John Doe',
        phone_number: '123-456-7890',
      },
    ];

    jest.spyOn(peopleRepository, 'findAll').mockResolvedValue(mockPeople);

    const result = await listPeopleUseCase.execute();

    expect(result).toEqual(mockPeople);
    expect(peopleRepository.findAll).toHaveBeenCalled();
  });
});
