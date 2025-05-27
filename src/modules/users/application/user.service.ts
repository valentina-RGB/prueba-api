import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/users/create-user.use-case';
import { GetUserUseCase } from './use-cases/users/get-user.use-case';
import { ListUserUseCase } from './use-cases/users/list-user.use-case';
import { UpdateUserUseCase } from './use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/users/delete-user.use-case';
import { CreateUserDto } from './dto/users/create-user.dto';
import { IUserService } from '../domain/user.service.interface';
import { UpdateUserDto } from './dto/users/update-user.dto';
import { GetUserByEmailUseCase } from './use-cases/users/get-by-email-user.use-case';
import { CreateRoleDto } from './dto/roles/create-role.dto';
import { CreateRoleUseCase } from './use-cases/roles/create-role.use-case';
import { GetRoleUseCase } from './use-cases/roles/get-role.use-case';
import { ListRolesUseCase } from './use-cases/roles/list-roles.use-case';
import { UpdatePersonDto } from './dto/people/update-people.dto';
import { CreatePeopleUseCase } from './use-cases/people/create-people.use-case';
import { GetPeopleUseCase } from './use-cases/people/get-people.use-case';
import { ListPeopleUseCase } from './use-cases/people/list-people.use-case';
import { UpdatePeopleUseCase } from './use-cases/people/update-people.use-case';
import { CreateClientUseCase } from './use-cases/clients/create-clients.use-case';
import { GetClientUseCase } from './use-cases/clients/get-client.use-case';
import { ListClientUseCase } from './use-cases/clients/list-client.use-case';
import { IAdministrator } from '../domain/models/admin.interface';
import { RegisterStoreAdminUseCase } from './use-cases/admins/create-store-admin.use-case';
import { ListAdminsUseCase } from './use-cases/admins/list-admins.use-case';
import { UpdateClientUseCase } from './use-cases/clients/update-client.use-case';
import { GetRoleByNameUseCase } from './use-cases/roles/get-role-by-name.use-case';
import { CreateEmployeeUseCase } from './use-cases/employees/create-employee.use-case';
import { ListEmployeesUseCase } from './use-cases/employees/list-employee.use-case';
import { GetEmployeeUseCase } from './use-cases/employees/get-employee.use-case';
import { CreateEmployeeDto } from './dto/employee/create-employee.dto';
import { CreatePeopleDto } from './dto/people/create-people-dto';
import { GetClientByUserUseCase } from './use-cases/clients/get-client-by-user.use-case';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { ToggleClientVerificationUseCase } from './use-cases/clients/toggle-client-verification.use-case';
import { IClient } from '../domain/models/client.interface';
import { GetAdminByUserUseCase } from './use-cases/admins/get-admin-by-user.use-case';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly getRoleByNameUseCase: GetRoleByNameUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,

    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly listUsersUseCase: ListUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    
    private readonly createPeopleUseCase: CreatePeopleUseCase,
    private readonly getPeopleUseCase: GetPeopleUseCase,
    private readonly listPeoplesUseCase: ListPeopleUseCase,
    private readonly updatePeopleUseCase: UpdatePeopleUseCase,

    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly getClientByUserUseCase: GetClientByUserUseCase,
    private readonly listClientsUseCase: ListClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly addCoffeeCoinsUseCase: AddCoffeeCoinsToClientUseCase,
    private readonly toggleClientVerification: ToggleClientVerificationUseCase,


    private readonly registerStoreAdminUseCase: RegisterStoreAdminUseCase,
    private readonly listAdminsUseCase: ListAdminsUseCase,
    private readonly getAdminUseCase: GetAdminByUserUseCase,

    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly listEmployeeUseCase: ListEmployeesUseCase,
    private readonly getByIdEmployeeUseCase: GetEmployeeUseCase,
  ) {}

  async createRole(data: CreateRoleDto) {
    return this.createRoleUseCase.execute(data);
  }

  async findRoleById(id: number) {
    return this.getRoleUseCase.execute(id);
  }

  async findRoleByName(name: string) {
    return this.getRoleByNameUseCase.execute(name);
  }

  async findAllRoles() {
    return this.listRolesUseCase.execute();
  }
  //------------------------------------------------------
  async createUser(userData: CreateUserDto) {
    return this.createUserUseCase.execute({ userData });
  }

  async createUserWithPassword(userData: CreateUserDto) {
    return this.createUserUseCase.execute({ userData });
  }

  async getUser(id: number) {
    return this.getUserUseCase.execute(id);
  }

  async listUsers() {
    return this.listUsersUseCase.execute();
  }

  async findUserByEmail(email: string) {
    return this.getUserByEmailUseCase.execute(email);
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, data });
  }

  async deleteUser(id: number) {
    return await this.deleteUserUseCase.execute(id);
  }

  // --------------------------------------------------------

  async createPerson(userData: CreateUserDto, personData: CreatePeopleDto) {
    return this.createPeopleUseCase.execute({ userData, personData });
  }

  async getPerson(id: number) {
    return this.getPeopleUseCase.execute(id);
  }

  async listPeople() {
    return this.listPeoplesUseCase.execute();
  }

  async updatePerson(id: number, data: UpdatePersonDto) {
    return this.updatePeopleUseCase.execute({ id, data });
  }

  // //------------------------------------------------------
  async createClient(userData: CreateUserDto, personData: CreatePeopleDto) {
    return this.createClientUseCase.execute({ userData, personData });
  }

  async getClient(id: number) {
    return this.getClientUseCase.execute(id);
  }

  async getClientByUser(id: number) {
    return this.getClientByUserUseCase.execute(id);
  }

  async listClients() {
    return this.listClientsUseCase.execute();
  }

  async updateClient(id: number, data: UpdatePersonDto) {
    return this.updateClientUseCase.execute({ userId: id, personData: data });
  }

  async addCoffeecoinsToClient(id: number, coffeecoins: number) {
    return this.addCoffeeCoinsUseCase.execute({ id, coffeecoins });
  }

  async verifyClient(id: number, isVerify: boolean): Promise< IClient> {
  return this.toggleClientVerification.execute({id, isVerify});
}


  // --------------------------------------------------------

  async createEmployee(
    employeeData: CreateEmployeeDto,
    userData: CreateUserDto,
    personData: CreatePeopleDto,
  ) {
    return this.createEmployeeUseCase.execute({
      employeeData,
      userData,
      personData,
    });
  }
  async findAllEmployees() {
    return this, this.listEmployeeUseCase.execute();
  }
  async findEmployeeById(id: number) {
    return this.getByIdEmployeeUseCase.execute(id);
  }
  // -----------------------------------------------------
  async listAdmin() {
    return this.listAdminsUseCase.execute();
  }

  async getAdminByUserId(id: number) {
    return this.getAdminUseCase.execute(id);
  }

  async createSystemAdmin(
    userData: CreateUserDto,
    personData: CreatePeopleDto,
  ): Promise<IAdministrator> {
    throw new Error('Method not implemented.');
  }

  async createStoreAdmin(
    storeData: any,
    userData: CreateUserDto,
    personData: CreatePeopleDto,
  ): Promise<IAdministrator> {
    return this.registerStoreAdminUseCase.execute({
      storeData,
      userData,
      personData,
    });
  }

  async createBranchAdmin(
    branchData: any,
    userData: CreateUserDto,
    personData: CreatePeopleDto,
  ): Promise<IAdministrator> {
    throw new Error('Method not implemented.');
  }
}
