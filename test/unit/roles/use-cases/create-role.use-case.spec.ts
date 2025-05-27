import { ConflictException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateRoleUseCase } from 'src/modules/users/application/use-cases/roles/create-role.use-case';
import { IRoleCreateDTO } from 'src/modules/users/domain/dto/role.dto.interface';
import { IRole } from 'src/modules/users/domain/models/role.interface';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from 'src/modules/users/domain/repositories/role.repository.interface';

describe('CreateRoleUseCase', () => {
  let createRoleUseCase: CreateRoleUseCase;
  let roleRepository: IRoleRepository;

  beforeEach(async () => {
    const mockRoleRepository = {
      create: jest.fn(),
      findByName: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRoleUseCase,
        {
          provide: IRoleRepositoryToken,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    createRoleUseCase = moduleFixture.get<CreateRoleUseCase>(CreateRoleUseCase);
    roleRepository = moduleFixture.get<IRoleRepository>(IRoleRepositoryToken);
  });

  it('Should create a role successfully', async () => {
    const roleDto: IRoleCreateDTO = {
      name: 'Admin',
    };
    const createRole: IRole = {
      id: 1,
      name: 'Admin',
      status: true,
    };

    jest.spyOn(roleRepository, 'create').mockResolvedValue(createRole);
    const result = await createRoleUseCase.execute(roleDto);

    expect(result).toEqual(createRole);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Admin');
  });

  it('Should throw a ConflictException if the role already exists', async () => {
    const roleDto: IRoleCreateDTO = {
      name: 'Admin',
    };
    const existingRole: IRole = {
      id: 1,
      name: 'Admin',
      status: true,
    };

    jest.spyOn(roleRepository, 'findByName').mockResolvedValue(existingRole);
    jest.spyOn(roleRepository, 'create').mockResolvedValue(existingRole);

    await expect(createRoleUseCase.execute(roleDto)).rejects.toThrow(
      ConflictException,
    );

    expect(roleRepository.findByName).toHaveBeenCalledWith(roleDto.name);
    expect(roleRepository.create).not.toHaveBeenCalled();
  });
});
