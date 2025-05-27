const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const moduleName = args[0];
const migrationName = args[1];

if (!moduleName || !migrationName) {
  console.error('❌ Uso: npm run db:migrate:create <modulo> <NombreDeMigracion>');
  process.exit(1);
}

const dataSourcePath = path.resolve(__dirname, '../src/config/data-source.ts');

const migrationPath = path.join('src', 'modules', moduleName, 'infrastructure', 'database', 'migrations');

console.log(`🚀 Creating migration at: ${migrationPath}`);

// try {
    execSync(`npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:generate -d ${dataSourcePath} ${migrationPath}/${migrationName}`, { stdio: 'inherit' });
// } catch (error) {
//   console.error('❌ Error al generar la migración:', error.message);
//   process.exit(1);
// }
