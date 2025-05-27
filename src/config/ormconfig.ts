import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

const rootDir = __dirname.includes('dist') ? 'dist' : 'src';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

console.log('Database config:', {
  isProd,
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
});

const ormconfig: DataSourceOptions & SeederOptions = {
  type: isTest ? 'sqlite' : 'postgres',
  ...(isTest
    ? {
        database: ':memory:',
      }
    : isProd
      ? {
          url: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
  entities: [`${rootDir}/modules/**/infrastructure/entities/*.{ts,js}`],
  migrations: [
    `${rootDir}/modules/**/infrastructure/database/migrations/*.{ts,js}`,
    `${rootDir}/infrastructure/database/migrations/*.{ts,js}`,
  ],
  synchronize: isTest,
  migrationsRun: false,
  logging: isTest ? ['error', 'warn'] : !isProd,
} as DataSourceOptions & SeederOptions;

export default ormconfig;
