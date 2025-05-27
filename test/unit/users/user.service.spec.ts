import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../src/modules/users/application/use-cases/users/create-user.use-case';
import { GetUserUseCase } from '../../../src/modules/users/application/use-cases/users/get-user.use-case';
import { GetUserByEmailUseCase } from '../../../src/modules/users/application/use-cases/users/get-by-email-user.use-case';
import { ListUserUseCase } from '../../../src/modules/users/application/use-cases/users/list-user.use-case';
import { UpdateUserUseCase } from '../../../src/modules/users/application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../../src/modules/users/application/use-cases/users/delete-user.use-case';
import { IUser } from '../../../src/modules/users/domain/models/user.interface';
import { IPasswordHasherServiceToken } from '../../../src/modules/users/domain/external-services/password-hasher.interface.service';
import { RoleEntity } from '../../../src/modules/users/infrastructure/entities/role.entity';
import { UserService } from 'src/modules/users/application/user.service';
import {
  IUserCreateDto,
  IUserUpdateDto,
} from 'src/modules/users/domain/dto/user.dto.interface';
import { CreateRoleUseCase } from 'src/modules/users/application/use-cases/roles/create-role.use-case';
import { GetRoleUseCase } from 'src/modules/users/application/use-cases/roles/get-role.use-case';
import { ListRolesUseCase } from 'src/modules/users/application/use-cases/roles/list-roles.use-case';
import { CreateClientUseCase } from 'src/modules/users/application/use-cases/clients/create-clients.use-case';
import { GetClientUseCase } from 'src/modules/users/application/use-cases/clients/get-client.use-case';
import { ListClientUseCase } from 'src/modules/users/application/use-cases/clients/list-client.use-case';
import { CreatePeopleUseCase } from 'src/modules/users/application/use-cases/people/create-people.use-case';
import { GetPeopleUseCase } from 'src/modules/users/application/use-cases/people/get-people.use-case';
import { ListPeopleUseCase } from 'src/modules/users/application/use-cases/people/list-people.use-case';
import { UpdatePeopleUseCase } from 'src/modules/users/application/use-cases/people/update-people.use-case';
import { RegisterStoreAdminUseCase } from 'src/modules/users/application/use-cases/admins/create-store-admin.use-case';
import { ListAdminsUseCase } from 'src/modules/users/application/use-cases/admins/list-admins.use-case';
import { UpdateClientUseCase } from 'src/modules/users/application/use-cases/clients/update-client.use-case';
import { GetRoleByNameUseCase } from 'src/modules/users/application/use-cases/roles/get-role-by-name.use-case';
import { CreateEmployeeUseCase } from 'src/modules/users/application/use-cases/employees/create-employee.use-case';
import { GetEmployeeUseCase } from 'src/modules/users/application/use-cases/employees/get-employee.use-case';
import { ListEmployeesUseCase } from 'src/modules/users/application/use-cases/employees/list-employee.use-case';
import { GetClientByUserUseCase } from 'src/modules/users/application/use-cases/clients/get-client-by-user.use-case';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { ToggleClientVerificationUseCase } from 'src/modules/users/application/use-cases/clients/toggle-client-verification.use-case';
import { GetAdminByUserUseCase } from 'src/modules/users/application/use-cases/admins/get-admin-by-user.use-case';

describe('UserService', () => {
  let userService: UserService;
  let createUserUseCase: CreateUserUseCase;
  let getUserUseCase: GetUserUseCase;
  let getUserByEmailUseCase: GetUserByEmailUseCase;
  let listUsersUseCase: ListUserUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let deleteUserUseCase: DeleteUserUseCase;
  let getRoleUseCase: GetRoleUseCase;

  const mockPasswordHasherService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockRole: RoleEntity = {
    id: 1,
    name: 'Admin',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    users: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: CreateRoleUseCase, useValue: { execute: jest.fn() } },
        { provide: GetRoleUseCase, useValue: { execute: jest.fn() } },
        { provide: GetRoleByNameUseCase, useValue: { execute: jest.fn() } },
        { provide: ListRolesUseCase, useValue: { execute: jest.fn() } },

        { provide: CreateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: GetUserUseCase, useValue: { execute: jest.fn() } },
        { provide: GetUserByEmailUseCase, useValue: { execute: jest.fn() } },
        { provide: ListUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteUserUseCase, useValue: { execute: jest.fn() } },

        { provide: CreatePeopleUseCase, useValue: { execute: jest.fn() } },
        { provide: GetPeopleUseCase, useValue: { execute: jest.fn() } },
        { provide: ListPeopleUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdatePeopleUseCase, useValue: { execute: jest.fn() } },

        { provide: CreateClientUseCase, useValue: { execute: jest.fn() } },
        { provide: GetClientUseCase, useValue: { execute: jest.fn() } },
        { provide: GetClientByUserUseCase, useValue: { execute: jest.fn() } },
        { provide: ListClientUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateClientUseCase, useValue: { execute: jest.fn() } },
        {
          provide: AddCoffeeCoinsToClientUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ToggleClientVerificationUseCase,
          useValue: { execute: jest.fn() },
        },

        {
          provide: RegisterStoreAdminUseCase,
          useValue: { execute: jest.fn() },
        },
        { provide: ListAdminsUseCase, useValue: { execute: jest.fn() } },
        { provide: GetAdminByUserUseCase, useValue: { execute: jest.fn() } },

        { provide: CreateEmployeeUseCase, useValue: { execute: jest.fn() } },
        { provide: ListEmployeesUseCase, useValue: { execute: jest.fn() } },
        { provide: GetEmployeeUseCase, useValue: { execute: jest.fn() } },

        {
          provide: IPasswordHasherServiceToken,
          useValue: mockPasswordHasherService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase);
    getUserByEmailUseCase = module.get<GetUserByEmailUseCase>(
      GetUserByEmailUseCase,
    );
    listUsersUseCase = module.get<ListUserUseCase>(ListUserUseCase);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    getRoleUseCase = module.get<GetRoleUseCase>(GetRoleUseCase);
  });

  it('should create a user', async () => {
    const mockRole = {
      id: 1,
      name: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userCreateDto: IUserCreateDto = {
      email: 'john@example.com',
      password: '123456',
      role: mockRole,
      status: true,
    };

    const user: IUser = {
      id: 1,
      email: 'john@example.com',
      password: '123456',
      role: mockRole,
      status: true,
    };

    (createUserUseCase.execute as jest.Mock).mockResolvedValue(user);

    const result = await userService.createUser(userCreateDto);

    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      userData: userCreateDto,
    });
    expect(result).toEqual(user);
  });

  it('should get a user by ID', async () => {
    const user: IUser = {
      id: 1,
      email: 'john@example.com',
      password: '123456',
      role: mockRole,
      status: true,
    };

    (getUserUseCase.execute as jest.Mock).mockResolvedValue(user);

    const result = await userService.getUser(1);

    expect(getUserUseCase.execute).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it('should list all users', async () => {
    const users: IUser[] = [
      {
        id: 1,
        email: 'john@example.com',
        role: mockRole,
        status: true,
      },
      {
        id: 2,
        email: 'jane@example.com',
        role: {
          id: 2,
          name: 'User',
          status: true,
        },
        status: true,
      },
    ];

    (listUsersUseCase.execute as jest.Mock).mockResolvedValue(users);

    const result = await userService.listUsers();

    expect(listUsersUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should update a user', async () => {
    const userUpdateDto: IUserUpdateDto = {
      email: 'johnupdated@example.com',
      role_id: 1,
    };

    const user: IUser = {
      id: 1,
      email: 'johnupdated@example.com',
      role: mockRole,
      status: true,
    };

    (updateUserUseCase.execute as jest.Mock).mockResolvedValue(user);

    const result = await userService.updateUser(1, userUpdateDto);

    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 1,
      data: userUpdateDto,
    });
    expect(result).toEqual(user);
  });

  it('should delete a user', async () => {
    (deleteUserUseCase.execute as jest.Mock).mockResolvedValue(undefined);

    await userService.deleteUser(1);

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(1);
  });
});
