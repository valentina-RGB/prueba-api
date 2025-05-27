import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdatePeopleUseCase } from 'src/modules/users/application/use-cases/people/update-people.use-case';
import {
  IPeopleRepository,
  IPeopleRepositoryToken,
} from 'src/modules/users/domain/repositories/people.repository.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';
import { IPersonUpdateDto } from 'src/modules/users/domain/dto/person.dto.interface';
import { GetUserByEmailUseCase } from 'src/modules/users/application/use-cases/users/get-by-email-user.use-case';
import { UpdateUserUseCase } from 'src/modules/users/application/use-cases/users/update-user.use-case';

describe('UpdatePeopleUseCase', () => {
  let updatePeopleUseCase: UpdatePeopleUseCase;
  let peopleRepository: IPeopleRepository;

  let mockGetUser: { execute: jest.Mock };
  let mockUpdateUser: { execute: jest.Mock };

  beforeEach(async () => {
    const mockPeopleRepository = {
      findById: jest.fn(),
      updatePeople: jest.fn(),
      findByIdentification: jest.fn(),
    };

    mockGetUser = { execute: jest.fn() };
    mockUpdateUser = { execute: jest.fn() };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        UpdatePeopleUseCase,
        { provide: IPeopleRepositoryToken, useValue: mockPeopleRepository },
        { provide: GetUserByEmailUseCase, useValue: mockGetUser },
        { provide: UpdateUserUseCase, useValue: mockUpdateUser },
      ],
    }).compile();

    updatePeopleUseCase = moduleFixture.get(UpdatePeopleUseCase);
    peopleRepository = moduleFixture.get(IPeopleRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates a person successfully (solo people)', async () => {
    const id = 1;
    const updateData: IPersonUpdateDto = {
      full_name: 'Jane Doe Updated',
      phone_number: '987-654-3211',
      type_document: 'ID',
    };

    const existingPerson: IPeople = {
      id: 1,
      user: {
        id: 1,
        email: 'jane@example.com',
        status: true,
        role: { id: 2, name: 'Client', status: true },
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'Jane Doe',
      phone_number: '987-654-3210',
    };

    const updatedPerson: IPeople = { ...existingPerson, ...updateData };

    (peopleRepository.findById as jest.Mock)
      .mockResolvedValueOnce(existingPerson)
      .mockResolvedValueOnce(updatedPerson);

    const result = await updatePeopleUseCase.execute({ id, data: updateData });

    expect(result).toEqual(updatedPerson);
    expect(peopleRepository.updatePeople).toHaveBeenCalledWith(id, updateData);
    expect(mockUpdateUser.execute).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when person does not exist', async () => {
    const id = 99;
    (peopleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updatePeopleUseCase.execute({ id, data: { full_name: 'X' } }),
    ).rejects.toThrow(new NotFoundException('People not found'));

    expect(peopleRepository.updatePeople).not.toHaveBeenCalled();
  });

  it('throws ConflictException when document number is duplicated', async () => {
    const id = 1;
    const existingPerson: IPeople = {
      id: 1,
      user: {
        id: 1,
        email: 'a@x.com',
        status: true,
        role: { id: 1, name: 'x', status: true },
      },
      type_document: 'ID',
      number_document: '123',
      full_name: 'A',
      phone_number: '000',
    };

    const duplicatedPerson: IPeople = {
      ...existingPerson,
      id: 2,
      number_document: '987654321',
    };

    (peopleRepository.findById as jest.Mock).mockResolvedValue(existingPerson);
    (peopleRepository.findByIdentification as jest.Mock).mockResolvedValue(
      duplicatedPerson,
    );

    await expect(
      updatePeopleUseCase.execute({
        id,
        data: { number_document: '987654321' },
      }),
    ).rejects.toThrow(new ConflictException('Document number already exists'));

    expect(peopleRepository.updatePeople).not.toHaveBeenCalled();
  });

  it('updates user when email or password provided', async () => {
    const id = 1;
    const updateData = {
      email: 'new@example.com',
      password: 'newPass',
    };

    const existingPerson: IPeople = {
      id: 1,
      user: {
        id: 1,
        email: 'old@example.com',
        status: true,
        role: { id: 2, name: 'Client', status: true },
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'Jane',
      phone_number: '999',
    };

    const updatedPerson = {
      ...existingPerson,
      user: { ...existingPerson.user, email: 'new@example.com' },
    };

    (peopleRepository.findById as jest.Mock)
      .mockResolvedValueOnce(existingPerson)
      .mockResolvedValueOnce(updatedPerson);

    mockGetUser.execute.mockResolvedValue(null);

    const result = await updatePeopleUseCase.execute({ id, data: updateData });

    expect(mockGetUser.execute).toHaveBeenCalledWith('new@example.com');
    expect(mockUpdateUser.execute).toHaveBeenCalledWith({
      id: 1,
      data: { email: 'new@example.com', password: 'newPass' },
    });
    expect(result).toEqual(updatedPerson);
  });
});
