import { DataSource } from 'typeorm';
import { CriteriaEntity } from 'src/modules/stores/infrastructure/entities/criteria.entity';

export const seedCriteria = async (dataSource: DataSource) => {
  try {
    const repo = dataSource.getRepository(CriteriaEntity);

    const criteriaList = [
      {
        id: 1,
        name: 'Café de especialidad',
        description:
          'Tener un café de especialidad, propio o de una marca que lo distribuya (puntaje mayor a 83).',
        requires_image: false,
      },
      {
        id: 2,

        name: 'Personal capacitado',
        description:
          'Tener barista o persona especializada en el café que tenga conocimiento sobre los procesos del café y conocer toda su trazabilidad (desde la semilla hasta la taza).',
        requires_image: false,
      },
      {
        id: 3,
        name: 'Métodos de preparación',
        description:
          'Ofrecer experiencias de café con diferentes métodos de preparación.',
        requires_image: false,
      },
      {
        id: 4,
        name: 'Máquina de espresso',
        description:
          'Contar con una máquina de espresso para preparar las bebidas.',
        requires_image: true,
      },
      {
        id: 5,
        name: 'Espacio adecuado',
        description:
          'Contar con un espacio adecuado para disfrutar de un café de especialidad.',
        requires_image: true,
      },
    ];

    for (const criteria of criteriaList) {
      const exists = await repo.findOne({
        where: { name: criteria.name },
      });
      if (exists) {
        exists.id = criteria.id;
        exists.name = criteria.name;
        exists.description = criteria.description;
        exists.requires_image = criteria.requires_image;
        await repo.save(exists);
      } else {
        const newCriteria = repo.create(criteria);
        await repo.save(newCriteria);
      }
    }

    await repo.save(criteriaList);
    console.log('✅ Criteria seeded successfully!');
  } catch (error) {
    console.error('❌ Error inserting criteria seeders:', error);
  }
};
