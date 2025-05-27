import { IEmployeeCreateDto } from './dto/employe.dto.interface';
import { IPersonCreateDto, IPersonUpdateDto } from './dto/person.dto.interface';
import { IRoleCreateDTO } from './dto/role.dto.interface';
import { IUserCreateDto, IUserUpdateDto } from './dto/user.dto.interface';
import { IAdministrator } from './models/admin.interface';
import { IClient } from './models/client.interface';
import { IEmployee } from './models/employe.interface';
import { IPeople } from './models/people.interface';
import { IRole } from './models/role.interface';
import { IUser } from './models/user.interface';

export interface IUserService {
  createRole(data: IRoleCreateDTO): Promise<IRole>;
  findRoleById(id: number): Promise<IRole | null>;
  findRoleByName(name: string): Promise<IRole | null>;
  findAllRoles(): Promise<IRole[]>;

  createUser(data: IUserCreateDto): Promise<IUser>;
  createUserWithPassword(data: IUserCreateDto): Promise<IUser>;
  getUser(id: number): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  listUsers(): Promise<IUser[]>;
  updateUser(id: number, data: IUserUpdateDto): Promise<IUser | null>;
  deleteUser(id: number): Promise<void>;

  createPerson(
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IPeople>;
  getPerson(id: number): Promise<IPeople | null>;
  listPeople(): Promise<IPeople[]>;
  updatePerson(id: number, data: IPersonUpdateDto): Promise<IPeople | null>;

  createClient(
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IClient>;
  getClient(id: number): Promise<IClient | null>;
  getClientByUser(userId: number): Promise<IClient | null>;
  listClients(): Promise<IClient[]>;
  updateClient(id: number, data: IPersonUpdateDto): Promise<IClient | null>;
  addCoffeecoinsToClient: (id: number, coffeecoins: number) => Promise<IClient>;
  verifyClient(clientId: number, isVerified: boolean): Promise<IClient>;

  createEmployee(
    employeeData: IEmployeeCreateDto,
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IEmployee>;
  findAllEmployees(): Promise<IEmployee[]>;
  findEmployeeById(id: number): Promise<IEmployee | null>;

  createSystemAdmin(
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IAdministrator>;
  createStoreAdmin(
    storeData: any,
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IAdministrator>;
  createBranchAdmin(
    branchData: any,
    userData: IUserCreateDto,
    personData: IPersonCreateDto,
  ): Promise<IAdministrator>;
  listAdmin(): Promise<IAdministrator[]>;
  getAdminByUserId(id: number): Promise<IAdministrator | null>;
}

export const IUserServiceToken = Symbol('IUserService');
