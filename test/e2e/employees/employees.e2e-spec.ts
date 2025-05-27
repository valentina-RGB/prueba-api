import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { server, token } from '../setup-e2e';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('EmployeeController', () => {
  function generateUniqueTestData() {
    const randomString = uuidv4().substring(0, 8);
    return {
      email: `test${randomString}@example.com`,
      documentNumber: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
  }

  async function createBranch() {
    await request(server).post('/api/v2/social-networks').send({
      name: 'Facebook',
    });

    await request(server).post('/api/v2/stores').send({
      id: 1,
      name: 'Test Store',
      type_document: 'NIT',
      number_document: '900123456',
      logo: 'test-logo.png',
      phone_number: '3011234567',
      email: 'store@example.com',
      status: 'APPROVED',
    });

    const branch = await request(server)
      .post('/api/v2/branches')
      .send({
        id: 1,
        store_id: 1,
        name: 'New Branch',
        phone_number: '3001234567',
        latitude: 10.12345,
        longitude: -75.6789,
        address: '123 Main Street',
        social_branches: [
          {
            social_network_id: 1,
            value: 'https://facebook.com/mi-sucursal',
            description: 'Facebook oficial',
          },
        ],
      });

    await request(server)
      .post('/api/v2/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: Role.EMPLOYEE });
  }

  async function createTestEmployee() {
    await createBranch();
    const testData = generateUniqueTestData();

    const userData = {
      email: testData.email,
      password: '1234',
    };

    const personData = {
      type_document: 'CC',
      number_document: testData.documentNumber,
      full_name: 'Test Employee',
      phone_number: testData.phone,
    };

    const employeeData = {
      employee_type: 'Barista',
      branch_id: 1,
    };

    const response = await request(server).post('/api/v2/employees').send({
      userData,
      personData,
      employeeData,
    });

    return response.body;
  }

  describe('POST /api/v2/employees', () => {
    it('should register a new employee successfully', async () => {
      await createBranch();
      const testData = generateUniqueTestData();

      const userData = {
        email: testData.email,
        password: '1234',
      };

      const personData = {
        type_document: 'CC',
        number_document: testData.documentNumber,
        full_name: 'Test Employee',
        phone_number: testData.phone,
      };

      const employeeData = {
        employee_type: 'Barista',
        branch_id: 1,
      };

      const response = await request(server)
        .post('/api/v2/employees')
        .send({
          userData,
          personData,
          employeeData,
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.employee.person.number_document).toBe(
        personData.number_document,
      );
      expect(response.body.employee.person.full_name).toBe(
        personData.full_name,
      );
      expect(response.body.employee.person.user_email).toBe(userData.email);
    });

    it('should return 409 if email already exists', async () => {
      const existingClient = await createTestEmployee();

      const duplicateUserData = {
        email: existingClient.employee.person.user_email,
        password: '1234',
      };

      const personData = {
        type_document: 'CC',
        number_document: generateUniqueTestData().documentNumber,
        full_name: 'Duplicate Client',
        phone_number: generateUniqueTestData().phone,
      };

      const employeeData = {
        employee_type: 'Barista',
        branch_id: 1,
      };

      await request(server)
        .post('/api/v2/employees')
        .send({
          userData: duplicateUserData,
          personData,
          employeeData,
        })
        .expect(409);
    });

    it('should return 400 if registration data is invalid', async () => {
      await createBranch();

      const invalidUserData = {
        email: 'invalid-email',
        password: 'short',
      };

      const personData = {
        type_document: 'CC',
        number_document: '14',
        full_name: 'Invalid Client',
        phone_number: '987654321',
      };

      const employeeData = {
        employee_type: 'Barista',
        branch_id: 1,
      };

      await request(server)
        .post('/api/v2/employees')
        .send({
          userData: invalidUserData,
          personData,
          employeeData,
        })
        .expect(400);
    });
  });

  describe('GET /api/v2/employees', () => {
    it('should return a list of employees', async () => {
      const response = await request(server)
        .get('/api/v2/employees')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.employee)).toBe(true);
      expect(response.body.employee.length).toBeGreaterThan(0);

      const first = response.body.employee[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('employee_type');
      expect(first).toHaveProperty('person');
      expect(first).toHaveProperty('branch');
    });
  });

  describe('GET /api/v2/employees/:id', () => {
    it('should return a employee by ID', async () => {
      const testClient = await createTestEmployee();

      const response = await request(server)
        .get(`/api/v2/employees/${testClient.employee.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.employee.id).toBe(testClient.employee.id);
    });

    it('should return 404 if employee not found', async () => {
      const nonExistentClientId = '99999999';
      await request(server)
        .get(`/api/v2/employees/${nonExistentClientId}`)
        .expect(404);
    });

    it('should return 400 if ID is invalid', async () => {
      await request(server).get('/api/v2/employees/invalid-id').expect(400);
    });
  });
});
