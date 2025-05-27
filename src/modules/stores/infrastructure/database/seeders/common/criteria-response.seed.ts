import { DataSource } from 'typeorm';
import { CriteriaResponseEntity } from '../../../entities/criteria-response.entity';
import { CriteriaEntity } from '../../../entities/criteria.entity';
import { BranchApprovalEntity } from '../../../entities/branch-approval.entity';

export const seedCriteriaResponse = async (dataSource: DataSource) => {
  try {
    const criteriaResponseRepository = dataSource.getRepository(
      CriteriaResponseEntity,
    );
    const criteriaRepository = dataSource.getRepository(CriteriaEntity);
    const branchApprovalRepository =
      dataSource.getRepository(BranchApprovalEntity);

    const criteriaResponseList = [
      // --------------------- Branch 1 ---------------------------
      {
        id: 1,
        approval: await branchApprovalRepository.findOne({ where: { id: 1 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 1 } }),
        response_text:
          'Usamos café con puntuación de 86, de origen colombiano.',
        image_url: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        approval: await branchApprovalRepository.findOne({ where: { id: 1 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 2 } }),
        response_text: 'Nuestro barista principal está certificado por la SCA.',
      },
      {
        id: 3,
        approval: await branchApprovalRepository.findOne({ where: { id: 1 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 3 } }),
        response_text: 'Ofrecemos V60, Chemex y prensa francesa.',
      },
      // --------------------- Branch 2 ---------------------------
      {
        id: 4,
        approval: await branchApprovalRepository.findOne({ where: { id: 2 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 3 } }),
        response_text:
          'Disponemos de métodos como Aeropress y métodos manuales con Kalita y sifón japonés.',
        image_url: 'https://example.com/image1.jpg',
      },
      {
        id: 5,
        approval: await branchApprovalRepository.findOne({ where: { id: 2 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 5 } }),
        response_text:
          'El espacio está diseñado con luz natural y mobiliario cómodo.',
      },
      // --------------------- Branch 3 ---------------------------
      {
        id: 6,
        approval: await branchApprovalRepository.findOne({ where: { id: 3 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 4 } }),
        response_text: 'Contamos con una La Marzocco Linea Mini.',
        image_url: 'https://example.com/image1.jpg',
      },
      {
        id: 7,
        approval: await branchApprovalRepository.findOne({ where: { id: 3 } }),
        criteria: await criteriaRepository.findOne({ where: { id: 3 } }),
        response_text: 'Ofrecemos prensa francesa.',
      },
    ];

    for (const criteriaResponse of criteriaResponseList) {
      if (!criteriaResponse.approval) {
        console.warn('⚠️ Missing approval, skipping...');
        console.log(criteriaResponse.approval!.id);
        continue;
      }

      if (!criteriaResponse.criteria) {
        console.warn('⚠️ Missing criteria, skipping...');
        console.log(criteriaResponse.criteria!.id);
        continue;
      }

      const exists = await criteriaResponseRepository.findOne({
        where: {
          approval: { id: criteriaResponse.approval.id },
          criteria: { id: criteriaResponse.criteria.id },
        },
        relations: ['approval', 'criteria'],
      });

      if (exists) {
        exists.id = criteriaResponse.id;
        exists.response_text = criteriaResponse.response_text;
        await criteriaResponseRepository.save(exists);
      } else {
        const newCriteriaResponse = criteriaResponseRepository.create({
          id: criteriaResponse.id,
          approval: criteriaResponse.approval,
          criteria: criteriaResponse.criteria,
          response_text: criteriaResponse.response_text,
          image_url: criteriaResponse.image_url,
        });
        await criteriaResponseRepository.save(newCriteriaResponse);
      }
    }

    console.log('✅ Criteria responses seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting criteria responses seeders:', error);
  }
};
