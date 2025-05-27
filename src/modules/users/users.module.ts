import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from '../stores/stores.module';
import { MailerModule } from '../mailer/mailer.module';

// Controllers
import { UserController } from './infrastructure/controllers/user.controller';
import { RoleController } from './infrastructure/controllers/role.controller';
import { PeopleController } from './infrastructure/controllers/people.controller';
import { ClientController } from './infrastructure/controllers/client.controller';
import { EmployeeController } from './infrastructure/controllers/employee.controller';
import { AdminController } from './infrastructure/controllers/admin.controller';

// Entities
import { UserEntity } from './infrastructure/entities/user.entity';
import { RoleEntity } from './infrastructure/entities/role.entity';
import { PeopleEntity } from './infrastructure/entities/people.entity';
import { ClientEntity } from './infrastructure/entities/client.entity';
import { AdministratorEntity } from './infrastructure/entities/admin.entity';
import { EmployeEntity } from './infrastructure/entities/employe.entity';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';
import { RoleRepository } from './infrastructure/repositories/role.repository';
import { PeopleRepository } from './infrastructure/repositories/people.repository';
import { ClientRepository } from './infrastructure/repositories/client.repository';
import { AdminRepository } from './infrastructure/repositories/admin.repository';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';

// Services
import { UserService } from './application/user.service';
import { PasswordHasherService } from './infrastructure/providers/bcrypt-hasher.service';

// Use Cases
import { CreateUserUseCase } from './application/use-cases/users/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/users/get-user.use-case';
import { ListUserUseCase } from './application/use-cases/users/list-user.use-case';
import { CreateClientUseCase } from './application/use-cases/clients/create-clients.use-case';
import { GetClientUseCase } from './application/use-cases/clients/get-client.use-case';
import { ListClientUseCase } from './application/use-cases/clients/list-client.use-case';
import { ToggleClientVerificationUseCase } from './application/use-cases/clients/toggle-client-verification.use-case';
import { CreatePeopleUseCase } from './application/use-cases/people/create-people.use-case';
import { GetPeopleUseCase } from './application/use-cases/people/get-people.use-case';
import { ListPeopleUseCase } from './application/use-cases/people/list-people.use-case';
import { UpdatePeopleUseCase } from './application/use-cases/people/update-people.use-case';
import { CreateRoleUseCase } from './application/use-cases/roles/create-role.use-case';
import { GetRoleUseCase } from './application/use-cases/roles/get-role.use-case';
import { ListRolesUseCase } from './application/use-cases/roles/list-roles.use-case';
import { DeleteUserUseCase } from './application/use-cases/users/delete-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/users/get-by-email-user.use-case';
import { RegisterWithGoogleUseCase } from './application/use-cases/users/register-with-google.use-case';
import { UpdateUserUseCase } from './application/use-cases/users/update-user.use-case';
import { RegisterStoreAdminUseCase } from './application/use-cases/admins/create-store-admin.use-case';
import { ListAdminsUseCase } from './application/use-cases/admins/list-admins.use-case';
import { GetAdminUseCase } from './application/use-cases/admins/get-admin.use-case';
import { UpdateClientUseCase } from './application/use-cases/clients/update-client.use-case';
import { GetRoleByNameUseCase } from './application/use-cases/roles/get-role-by-name.use-case';
import { CreateEmployeeUseCase } from './application/use-cases/employees/create-employee.use-case';
import { ListEmployeesUseCase } from './application/use-cases/employees/list-employee.use-case';
import { GetEmployeeUseCase } from './application/use-cases/employees/get-employee.use-case';


// Tokens
import { IUserRepositoryToken } from './domain/repositories/user.repository.interface';
import { IUserServiceToken } from './domain/user.service.interface';
import { IPasswordHasherServiceToken } from './domain/external-services/password-hasher.interface.service';
import { IRoleRepositoryToken } from './domain/repositories/role.repository.interface';
import { IPeopleRepositoryToken } from './domain/repositories/people.repository.interface';
import { IClientRepositoryToken } from './domain/repositories/client.repository.interface';
import { IAdminRepositoryToken } from './domain/repositories/admin.repository.interface';
import { IEmployeeRepositoryToken } from './domain/repositories/employe.repository.interface';
import { GetClientByUserUseCase } from './application/use-cases/clients/get-client-by-user.use-case';
import { AlbumModule } from '../albums/album.module';
import { AddCoffeeCoinsToClientUseCase } from './application/use-cases/clients/add-coffee-coins.use-case';
import { GetAdminByUserUseCase } from './application/use-cases/admins/get-admin-by-user.use-case';

@Module({
  imports: [
    MailerModule,
    forwardRef(() => StoreModule),
    forwardRef(() => AlbumModule),
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      PeopleEntity,
      ClientEntity,
      AdministratorEntity,
      EmployeEntity,
    ]),
    RouterModule.register([
      {
        path: 'api/v2',
        module: UsersModule,
      },
    ]),
  ],
  controllers: [
    UserController,
    RoleController,
    PeopleController,
    ClientController,
    AdminController,
    EmployeeController,
  ],
  providers: [
    // Repositories
    { provide: IRoleRepositoryToken, useClass: RoleRepository },
    { provide: IUserRepositoryToken, useClass: UserRepository },
    { provide: IPeopleRepositoryToken, useClass: PeopleRepository },
    { provide: IClientRepositoryToken, useClass: ClientRepository },
    { provide: IAdminRepositoryToken, useClass: AdminRepository },
    { provide: IEmployeeRepositoryToken, useClass: EmployeeRepository },

    // Services
    { provide: IUserServiceToken, useClass: UserService },
    { provide: IPasswordHasherServiceToken, useClass: PasswordHasherService },

    CreateRoleUseCase,
    GetRoleUseCase,
    GetRoleByNameUseCase,
    ListRolesUseCase,

    CreateUserUseCase,
    RegisterWithGoogleUseCase,
    GetUserUseCase,
    ListUserUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    CreatePeopleUseCase,
    GetPeopleUseCase,
    ListPeopleUseCase,
    UpdatePeopleUseCase,

    CreateClientUseCase,
    ListClientUseCase,
    GetClientUseCase,
    GetClientByUserUseCase,
    UpdateClientUseCase,
    AddCoffeeCoinsToClientUseCase,
    ToggleClientVerificationUseCase,

    RegisterStoreAdminUseCase,
    ListAdminsUseCase,
    GetAdminUseCase,
    GetAdminByUserUseCase,

    CreateEmployeeUseCase,
    ListEmployeesUseCase,
    GetEmployeeUseCase,
  ],
  exports: [
    ListUserUseCase,
    GetUserUseCase,
    GetUserByEmailUseCase,

    GetAdminUseCase,
    GetClientUseCase,
    GetClientByUserUseCase,
    AddCoffeeCoinsToClientUseCase,
    GetAdminByUserUseCase,
    
    IPasswordHasherServiceToken,
    IUserServiceToken,
    IUserRepositoryToken,
    IEmployeeRepositoryToken,
  ],
})
export class UsersModule {}
