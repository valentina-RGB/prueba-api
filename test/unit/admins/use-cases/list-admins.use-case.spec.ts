import { TestingModule, Test } from '@nestjs/testing';
import { ListAdminsUseCase } from 'src/modules/users/application/use-cases/admins/list-admins.use-case';
import {
  IAdminRepository,
  IAdminRepositoryToken,
} from 'src/modules/users/domain/repositories/admin.repository.interface';

describe('ListAdminsUseCase', () => {
  let listAdminUseCase: ListAdminsUseCase;
  let adminRepository: IAdminRepository;

  beforeEach(async () => {
    const mockAdminRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ListAdminsUseCase,
        {
          provide: IAdminRepositoryToken,
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    listAdminUseCase = moduleFixture.get<ListAdminsUseCase>(ListAdminsUseCase);
    adminRepository = moduleFixture.get<IAdminRepository>(
      IAdminRepositoryToken,
    );
  });

  it('should be defined', () => {
    expect(listAdminUseCase).toBeDefined();
  });

  it('should call adminRepository.findAll()', async () => {
    const spy = jest.spyOn(adminRepository, 'findAll').mockResolvedValue([]);

    await listAdminUseCase.execute();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return all admins successfully', async () => {
    const mockPeople = [
      {
        id: 1,
        user: {
          role_id: 1,
          email: 'john@example.com',
          password: 'password123',
        },
        type_document: 'CC',
        number_document: '123456789',
        full_name: 'John Doe',
        phone_number: '123456789',
      },
      {
        id: 2,
        user: {
          role_id: 1,
          email: 'alice@example.com',
          password: 'password123',
        },
        type_document: 'CC',
        number_document: '987654321',
        full_name: 'Alice Smith',
        phone_number: '123456789',
      },
    ];

    const mockAdmins = [
      { person: mockPeople[0], admin_type: 'SYSTEM', entity_id: null },
      { person: mockPeople[1], admin_type: 'SYSTEM', entity_id: null },
    ];

    adminRepository.findAll = jest.fn().mockResolvedValue(mockAdmins);

    const result = await listAdminUseCase.execute();

    expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockAdmins);
    expect(result.length).toBe(2);
  });

  it('should return an empty array when no users exist', async () => {
    adminRepository.findAll = jest.fn().mockResolvedValue([]);

    const result = await listAdminUseCase.execute();

    expect(adminRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});
