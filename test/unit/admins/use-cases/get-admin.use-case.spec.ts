import { Test } from '@nestjs/testing';
import {
  IAdminRepository,
  IAdminRepositoryToken,
} from 'src/modules/users/domain/repositories/admin.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import { GetAdminUseCase } from 'src/modules/users/application/use-cases/admins/get-admin.use-case';

describe('GetAdminUseCase', () => {
  let getAdminUseCase: GetAdminUseCase;
  let adminRepository: IAdminRepository;

  beforeEach(async () => {
    const mockAdminRepository = {
      findById: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetAdminUseCase,
        {
          provide: IAdminRepositoryToken,
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    getAdminUseCase = moduleFixture.get<GetAdminUseCase>(GetAdminUseCase);
    adminRepository = moduleFixture.get<IAdminRepository>(
      IAdminRepositoryToken,
    );
  });

  it('should get an administrator by ID', async () => {
    const mockAdmin: IAdministrator = {
      id: 1,
      person: {
        id: 1,
        full_name: 'John Doe',
        number_document: '12345678',
        type_document: 'CC',
        phone_number: '123456789',
        user: {
          id: 1,
          role: { id: 1, name: 'Admin', status: true },
          email: 'john@gmail.com',
          password: '1234',
          status: true,
        },
      },
      admin_type: 'SYSTEM',
      entity_id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(adminRepository, 'findById').mockResolvedValue(mockAdmin);

    const result = await getAdminUseCase.execute(1);

    expect(result).toEqual(mockAdmin);
    expect(adminRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if administrator is not found', async () => {
    jest.spyOn(adminRepository, 'findById').mockResolvedValue(null);

    await expect(getAdminUseCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(adminRepository.findById).toHaveBeenCalledWith(1);
  });
});
