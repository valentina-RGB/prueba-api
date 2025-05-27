import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetRoleUseCase } from 'src/modules/users/application/use-cases/roles/get-role.use-case';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from 'src/modules/users/domain/repositories/role.repository.interface';

describe('GetRoleByIdUseCase', () => {
  let getRoleUseCase: GetRoleUseCase;
  let roleRepository: IRoleRepository;

  beforeEach(async () => {
    const mockRoleRepository = {
      findById: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GetRoleUseCase,
        {
          provide: IRoleRepositoryToken,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    getRoleUseCase = moduleFixture.get<GetRoleUseCase>(GetRoleUseCase);
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

    jest.spyOn(roleRepository, 'findById').mockResolvedValue(role);

    const result = await getRoleUseCase.execute(1);

    expect(result).toEqual(role);
    expect(roleRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an error if the role does not exist', async () => {
    jest.spyOn(roleRepository, 'findById').mockResolvedValue(null);

    await expect(getRoleUseCase.execute(999)).rejects.toThrow(
      new NotFoundException('Role not found'),
    );
  });
});
