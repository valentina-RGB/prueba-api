import { Test, TestingModule } from '@nestjs/testing';
import { UpdateClientUseCase } from 'src/modules/users/application/use-cases/clients/update-client.use-case';
import {
  IClientRepository,
  IClientRepositoryToken,
} from 'src/modules/users/domain/repositories/client.repository.interface';
import { UpdatePeopleUseCase } from 'src/modules/users/application/use-cases/people/update-people.use-case';
import { NotFoundException } from '@nestjs/common';
import { UpdatePersonDto } from 'src/modules/users/application/dto/people/update-people.dto';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase;
  let clientRepository: IClientRepository;
  let updatePersonUseCase: UpdatePeopleUseCase;

  beforeEach(async () => {
    const mockClientRepository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
    };

    const mockUpdatePersonUseCase = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateClientUseCase,
        {
          provide: IClientRepositoryToken,
          useValue: mockClientRepository,
        },
        {
          provide: UpdatePeopleUseCase,
          useValue: mockUpdatePersonUseCase,
        },
      ],
    }).compile();

    updateClientUseCase =
      moduleFixture.get<UpdateClientUseCase>(UpdateClientUseCase);
    clientRepository = moduleFixture.get<IClientRepository>(
      IClientRepositoryToken,
    );
    updatePersonUseCase =
      moduleFixture.get<UpdatePeopleUseCase>(UpdatePeopleUseCase);
  });

  it('should update a client successfully', async () => {
    const userId = 1;
    const personData: UpdatePersonDto = {
      full_name: 'Updated Name',
      phone_number: '9876543210',
    };

    const mockPerson: IPeople = {
      id: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        role: { id: 1, name: 'Admin', status: true },
        status: true,
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

    const mockClient: IClient = {
      id: 1,
      person: mockPerson,
      coffee_coins: 0,
      is_verified: false,
    };

    const updatedPerson: IPeople = {
      ...mockPerson,
      ...personData,
    };

    const updatedClient: IClient = {
      id: 1,
      person: updatedPerson,
      coffee_coins: 0,
      is_verified: false,
    };

    jest
      .spyOn(clientRepository, 'findByUserId')
      .mockResolvedValueOnce(mockClient);
    jest.spyOn(updatePersonUseCase, 'execute').mockResolvedValue(updatedPerson);
    jest
      .spyOn(clientRepository, 'findById')
      .mockResolvedValueOnce(updatedClient);

    const result = await updateClientUseCase.execute({ userId, personData });

    expect(result).toEqual(updatedClient);
    expect(updatePersonUseCase.execute).toHaveBeenCalledWith({
      id: mockPerson.id,
      data: personData,
    });
    expect(clientRepository.findById).toHaveBeenCalledWith(mockClient.id);
  });

  it('should throw NotFoundException if the client does not exist', async () => {
    const userId = 99;
    const personData: UpdatePersonDto = {
      full_name: 'Updated Name',
      phone_number: '9876543210',
    };

    jest.spyOn(clientRepository, 'findByUserId').mockResolvedValue(null);

    await expect(
      updateClientUseCase.execute({ userId, personData }),
    ).rejects.toThrow(new NotFoundException('Client not found'));

    expect(updatePersonUseCase.execute).not.toHaveBeenCalled();
    expect(clientRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if no person data is provided to update', async () => {
    const userId = 1;
    const personData = {};

    const mockPerson: IPeople = {
      id: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        role: { id: 1, name: 'Admin', status: true },
        status: true,
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

    const mockClient: IClient = {
      id: 1,
      person: mockPerson,
      coffee_coins: 0,
      is_verified: false,
    };

    jest.spyOn(clientRepository, 'findByUserId').mockResolvedValue(mockClient);

    await expect(
      updateClientUseCase.execute({ userId, personData }),
    ).rejects.toThrow(new NotFoundException('No data to update'));

    expect(updatePersonUseCase.execute).not.toHaveBeenCalled();
    expect(clientRepository.findById).not.toHaveBeenCalled();
  });
});
