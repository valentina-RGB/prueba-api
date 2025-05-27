import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetRoleByNameUseCase } from 'src/modules/users/application/use-cases/roles/get-role-by-name.use-case';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from 'src/modules/users/domain/repositories/role.repository.interface';

describe('GetRoleByIdUseCase', () => {
  let getRoleByNameUseCase: GetRoleByNameUseCase;
  let roleRepository: IRoleRepository;

  beforeEach(async () => {
    const mockRoleRepository = {
      findByName: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetRoleByNameUseCase,
        {
          provide: IRoleRepositoryToken,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    getRoleByNameUseCase =
      moduleFixture.get<GetRoleByNameUseCase>(GetRoleByNameUseCase);
    roleRepository = moduleFixture.get<IRoleRepository>(IRoleRepositoryToken);
  });

  it('should get a role by ID', async () => {
    const role = {
      id: 1,
      name: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(roleRepository, 'findByName').mockResolvedValue(role);

    const result = await getRoleByNameUseCase.execute(role.name);

    expect(result).toEqual(role);
    expect(roleRepository.findByName).toHaveBeenCalledWith(role.name);
  });

  it('should throw an error if the role does not exist', async () => {
    jest.spyOn(roleRepository, 'findByName').mockResolvedValue(null);

    await expect(getRoleByNameUseCase.execute('RoleTest')).rejects.toThrow(
      new NotFoundException('Role not found'),
    );
  });
});
