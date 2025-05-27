import { DataSource } from 'typeorm';
import { RoleEntity } from '../../../entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  try {
    const roleRepository = dataSource.getRepository(RoleEntity);

    const roles = [
      'Super Administrador',
      'Administrador de Tienda',
      'Administrador de Sucursal',
      'Cliente',
      'Empleado',
    ];

    for (const [index, name] of roles.entries()) {
      const roleId = index + 1;

      const existingRole = await roleRepository.findOne({ where: { id: roleId } });

      if (existingRole) {
        existingRole.name = name;
        existingRole.status = true;
        await roleRepository.save(existingRole);
      } else {
        const newRole = roleRepository.create({
          id: roleId,
          name,
          status: true,
        });
        await roleRepository.save(newRole);
      }
    }
    console.log('✅ Role seeders inserted successfully.');
  } catch (error) {
    console.error('❌ Error inserting role seeders:', error);
  }
};
