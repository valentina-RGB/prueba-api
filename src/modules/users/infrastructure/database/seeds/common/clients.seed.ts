import { DataSource } from 'typeorm';
import { ClientEntity } from '../../../entities/client.entity';
import { PeopleEntity } from '../../../entities/people.entity';

export const seedClients = async (dataSource: DataSource) => {
  try {
    const clientsRepository = dataSource.getRepository(ClientEntity);
    const peopleRepository = dataSource.getRepository(PeopleEntity);

    const clients = [
      {
        person: await peopleRepository.findOne({ where: { id: 4 } }),
      },
    ];

    for (const client of clients) {
      if (!client.person) {
        console.warn('⚠️ No person found for client, skipping...');
        continue;
      }

      const exists = await clientsRepository.findOne({
        where: { person: { id: client.person.id } },
        relations: ['person'],
      });

      if (exists) {
        exists.person = client.person!;
        await clientsRepository.save(exists);
      } else {
        const newClient = clientsRepository.create({
          person: client.person!,
        });
        await clientsRepository.save(newClient);
      }
    }
    console.log('✅ Client seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting clients seeders:', error);
  }
};
