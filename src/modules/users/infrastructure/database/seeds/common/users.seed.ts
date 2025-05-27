import { DataSource } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { PasswordHasherService } from '../../../providers/bcrypt-hasher.service';
import { RoleEntity } from '../../../entities/role.entity';

export const seedUsers = async (dataSource: DataSource) => {
  try {
    const userRepository = dataSource.getRepository(UserEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);
    const passwordHasher = new PasswordHasherService();

    const users = [
      {
        role: await roleRepository.findOne({ where: { id: 1 } }),
        email: 'superadmin@example.com',
        password: await passwordHasher.hash('1234'),
        status: true,
      },
      {
        role: await roleRepository.findOne({ where: { id: 2 } }),
        email: 'admintienda@example.com',
        password: await passwordHasher.hash('1234'),
        status: true,
      },
      {
        role: await roleRepository.findOne({ where: { id: 3 } }),
        email: 'adminsucursal@example.com',
        password: await passwordHasher.hash('1234'),
        status: true,
      },
      {
        role: await roleRepository.findOne({ where: { id: 4 } }),
        email: 'cliente@example.com',
        password: await passwordHasher.hash('1234'),
        status: true,
      },
    ];

    for (const user of users) {
      const exists = await userRepository.findOne({
        where: { email: user.email },
        relations: ['role'],
      });

      if (exists) {
        exists.role = user.role!;
        exists.password = user.password;
        exists.status = user.status;

        await userRepository.save(exists);
      } else {
        const newUser = userRepository.create({
          role: user.role!,
          email: user.email,
          password: user.password,
          status: user.status,
        });
        await userRepository.save(newUser);
      }
    }
    console.log('✅ User seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting user seeders:', error);
  }
};
