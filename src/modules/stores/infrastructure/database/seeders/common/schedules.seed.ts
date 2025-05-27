// import { DataSource } from 'typeorm';
// import { BranchesEntity } from '../../../entities/branches.entity';
// import { ScheduleEntity } from '../../../entities/schedule.entity';

// export const seedSchedules = async (dataSource: DataSource) => {
//   try {
//     const schedulesRepository = dataSource.getRepository(ScheduleEntity);
//     const branchRepository = dataSource.getRepository(BranchesEntity);

//     const branches = await branchRepository.findByIds([1, 2]);

//     const schedules = [
//       { day: 'Lunes', open_time: '08:00', close_time: '18:00' },
//       { day: 'Martes', open_time: '08:00', close_time: '18:00' },
//       { day: 'Miércoles', open_time: '08:00', close_time: '18:00' },
//       { day: 'Jueves', open_time: '08:00', close_time: '18:00' },
//       { day: 'Viernes', open_time: '08:00', close_time: '18:00' },
//       { day: 'Sábado', open_time: '09:00', close_time: '16:00' },
//       { day: 'Domingo', open_time: null, close_time: null },
//     ];

//     for (const branch of branches) {
//       for (const { day, open_time, close_time } of schedules) {
//         const existing = await schedulesRepository.findOne({
//           where: {
//             branch: { id: branch.id },
//             day,
//           },
//         });

//         if (existing) {
//           existing.open_time = open_time;
//           existing.close_time = close_time;
//           await schedulesRepository.save(existing);
//         } else {
//           const newSchedule = schedulesRepository.create({
//             branch,
//             day,
//             open_time,
//             close_time,
//           });
//           await schedulesRepository.save(newSchedule);
//         }
//       }
//     }

//     console.log('✅ Schedules seeded successfully');
//   } catch (error) {
//     console.error('❌ Error seeding schedules:', error);
//   }
// };
