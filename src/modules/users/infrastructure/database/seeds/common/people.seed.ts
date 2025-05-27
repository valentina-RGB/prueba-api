import { DataSource } from 'typeorm';
import { PeopleEntity } from '../../../entities/people.entity';
import { UserEntity } from '../../../entities/user.entity';

export const seedPeople = async (dataSource: DataSource) => {
  try {
    const peopleRepository = dataSource.getRepository(PeopleEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const people = [
      {
        user: await userRepository.findOne({
          where: { email: 'superadmin@example.com' },
        }),
        type_document: 'CC',
        number_document: '123456789',
        full_name: 'John Doe',
        phone_number: '1234567890',
      },
      {
        user: await userRepository.findOne({
          where: { email: 'admintienda@example.com' },
        }),
        type_document: 'TI',
        number_document: '987654321',
        full_name: 'Jane Smith',
        phone_number: '0987654321',
      },
      {
        user: await userRepository.findOne({
          where: { email: 'adminsucursal@example.com' },
        }),
        type_document: 'CC',
        number_document: '555555555',
        full_name: 'Alice Johnson',
        phone_number: '5555555555',
      },
      {
        user: await userRepository.findOne({
          where: { email: 'cliente@example.com' },
        }),
        type_document: 'CC',
        number_document: '444444444',
        full_name: 'Bob Brown',
        phone_number: '4444444444',
      },
    ];

    for (const person of people) {
      if (!person.user) {
        console.warn(
          `⚠️User not found for person ${person.full_name}, skipping...`,
        );
        continue;
      }

      const exists = await peopleRepository.findOne({
        where: { number_document: person.number_document },
        relations: ['user'],
      });

      if (exists) {
        exists.user = person.user;
        exists.type_document = person.type_document;
        exists.full_name = person.full_name;
        exists.phone_number = person.phone_number;

        await peopleRepository.save(exists);
      } else {
        const newPerson = peopleRepository.create({
          user: person.user,
          type_document: person.type_document,
          number_document: person.number_document,
          full_name: person.full_name,
          phone_number: person.phone_number,
        });
        await peopleRepository.save(newPerson);
      }
    }
    console.log('✅ People seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting people seeders:', error);
  }
};
