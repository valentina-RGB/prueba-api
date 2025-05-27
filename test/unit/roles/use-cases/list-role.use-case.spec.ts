import { Test } from '@nestjs/testing';
import { ListRolesUseCase } from 'src/modules/users/application/use-cases/roles/list-roles.use-case';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from 'src/modules/users/domain/repositories/role.repository.interface';

describe('ListRolesUseCase', () => {
  let listRoleUseCase: ListRolesUseCase;
  let roleRepository: IRoleRepository;

  beforeEach(async () => {
    const mockRoleRepository = {
      findAll: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        ListRolesUseCase,
        {
          provide: IRoleRepositoryToken,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    listRoleUseCase = moduleFixture.get<ListRolesUseCase>(ListRolesUseCase);
    roleRepository = moduleFixture.get<IRoleRepository>(IRoleRepositoryToken);
  });

  it('should return all roles successfully', async () => {
    const mockRoles = [
      {
        id: 1,
        name: 'Admin',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Client',
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(roleRepository, 'findAll').mockResolvedValue(mockRoles);

    const result = await listRoleUseCase.execute();

    expect(result).toEqual(mockRoles);
    expect(roleRepository.findAll).toHaveBeenCalled();
  });
});
