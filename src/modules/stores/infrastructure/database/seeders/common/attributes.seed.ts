import { DataSource } from 'typeorm';
import { AttributeEntity } from '../../../entities/attributes.entity';

export const seedAttributes = async (dataSource: DataSource) => {
  try {
    const attributesRepository = dataSource.getRepository(AttributeEntity);

    const attributes = [
      {
        name: 'Métodos de Café',
        requires_response: true,
        description:
          'Métodos de preparación disponibles (ej. V60, Chemex, Prensa Francesa, Espresso)',
      },
      {
        name: 'Coworking',
        requires_response: false,
        description: 'Espacio disponible para trabajar  (sí/no)',
      },
      {
        name: 'Salas privadas',
        requires_response: false,
        description: 'Salas privadas o mesas grandes para reuniones (sí/no)',
      },
      {
        name: 'Petfriendly',
        requires_response: false,
        description: 'Permiten mascotas (sí/no)',
      },
      {
        name: 'Espacios al aire libre',
        requires_response: false,
        description: 'Espacios al aire libre para sentarse (sí/no)',
      },
      {
        name: 'Wi-Fi',
        requires_response: false,
        description: 'Disponibilidad de Wi-Fi para clientes (sí/no)',
      },
      {
        name: 'Rango de Precio',
        requires_response: true,
        description:
          'Indica el nivel de precios de los productos ofrecidos por la cafetería(por ejemplo: 10.000$ - 50.000$) ',
      },
    ];

    for (const attribute of attributes) {
      const exists = await attributesRepository.findOne({
        where: { name: attribute.name },
      });

      if (exists) {
        exists.name = attribute.name;
        exists.requires_response = attribute.requires_response;
        exists.description = attribute.description;
        await attributesRepository.save(exists);
      } else {
        const newAttribute = attributesRepository.create(attribute);
        await attributesRepository.save(newAttribute);
      }
    }
    console.log('✅ Attributes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding attributes:', error);
  }
};
