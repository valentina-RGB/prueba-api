// import { DataSource } from 'typeorm';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
// import { AppDataSource } from '../../../src/config/data-source';
// import { EmployeEntity } from 'src/modules/users/infrastructure/entities/employe.entity';
// import { PeopleEntity } from 'src/modules/users/infrastructure/entities/people.entity';
// import { BranchesEntity } from 'src/modules/stores/infrastructure/entities/branches.entity';
// import { UserEntity } from 'src/modules/users/infrastructure/entities/user.entity';
// import { RoleEntity } from 'src/modules/users/infrastructure/entities/role.entity';
// import { StoreEntity } from 'src/modules/stores/infrastructure/entities/store.entity';
// import { Role } from 'src/modules/users/application/dto/enums/role.enum';

// describe('EmployeEntity - Repository Tests', () => {
//   let dataSource: DataSource;
//   let employeeRepository;
//   let peopleRepository;
//   let branchRepository;
//   let userRepository;
//   let roleRepository;
//   let storeRepository;

//   let testRole;
//   let testStore;
//   let testBranch;
//   let testUser;
//   let testPerson;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [TypeOrmModule.forRoot(AppDataSource.options)],
//     }).compile();

//     dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
//     employeeRepository = dataSource.getRepository(EmployeEntity);
//     peopleRepository = dataSource.getRepository(PeopleEntity);
//     branchRepository = dataSource.getRepository(BranchesEntity);
//     userRepository = dataSource.getRepository(UserEntity);
//     roleRepository = dataSource.getRepository(RoleEntity);
//     storeRepository = dataSource.getRepository(StoreEntity);
//   });

//   beforeEach(async () => {
//     await employeeRepository.clear();
//     await peopleRepository.clear();
//     await branchRepository.clear();
//     await userRepository.clear();
//     await roleRepository.clear();
//     await storeRepository.clear();

//     testRole = roleRepository.create({
//       name: Role.EMPLOYEE,
//       status: true
//     });
//     await roleRepository.save(testRole);

//     testStore = storeRepository.create({
//       name: 'Test Store',
//       type_document: 'NIT',
//       number_document: '900123456',
//       logo: 'test-logo.png',
//       phone_number: '3011234567',
//       email: 'store@example.com',
//       status: 'APPROVED'
//     });
//     await storeRepository.save(testStore);

//     testBranch = branchRepository.create({
//       store: testStore,
//       name: 'Test Branch',
//       phone_number: '3001234567',
//       latitude: 10.12345,
//       longitude: -75.6789,
//       address: '123 Main Street',
//       status: true
//     });
//     await branchRepository.save(testBranch);

//     testUser = userRepository.create({
//       email: 'john@example.com',
//       password: 'password123',
//       role: testRole,
//       status: true
//     });
//     await userRepository.save(testUser);

//     testPerson = peopleRepository.create({
//       type_document: 'CC',
//       number_document: '12345678',
//       full_name: 'John Doe',
//       phone_number: '3001234567',
//       user: testUser
//     });
//     await peopleRepository.save(testPerson);
//   });

//   afterAll(async () => {
//     if (dataSource.isInitialized) await dataSource.destroy();
//   });

//   test('should create a valid employee', async () => {
//     const employee = employeeRepository.create({
//       employee_type: 'Barista',
//       person: testPerson,
//       branch: testBranch
//     });

//     const savedEmployee = await employeeRepository.save(employee);
    
//     expect(savedEmployee.id).toBeDefined();
//     expect(savedEmployee.employee_type).toBe('Barista');
//     expect(savedEmployee.createdAt).toBeDefined();
//     expect(savedEmployee.updatedAt).toBeDefined();
    
//     const employeeWithRelations = await employeeRepository.findOne({
//       where: { id: savedEmployee.id },
//       relations: ['person', 'person.user', 'branch']
//     });
    
//     expect(employeeWithRelations.person.id).toBe(testPerson.id);
//     expect(employeeWithRelations.branch.id).toBe(testBranch.id);
//   });

//   test('should enforce required field: employee_type', async () => {
//     const invalidEmployee = employeeRepository.create({
//       person: testPerson,
//       branch: testBranch
//     });

//     await expect(employeeRepository.save(invalidEmployee)).rejects.toThrow();
//   });

//   test('should enforce required relation: person', async () => {
//     const invalidEmployee = employeeRepository.create({
//       employee_type: 'Barista',
//       branch: testBranch
//     });

//     await expect(employeeRepository.save(invalidEmployee)).rejects.toThrow();
//   });

//   test('should enforce required relation: branch', async () => {
//     const invalidEmployee = employeeRepository.create({
//       employee_type: 'Barista',
//       person: testPerson
//     });

//     await expect(employeeRepository.save(invalidEmployee)).rejects.toThrow();
//   });

//   test('should not allow duplicate person assignments', async () => {
//     const employee1 = employeeRepository.create({
//       employee_type: 'Barista',
//       person: testPerson,
//       branch: testBranch
//     });
//     await employeeRepository.save(employee1);

//     const employee2 = employeeRepository.create({
//       employee_type: 'Manager',
//       person: testPerson,
//       branch: testBranch
//     });
    
//     await expect(employeeRepository.save(employee2)).rejects.toThrow();
//   });

// });