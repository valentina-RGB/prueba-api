import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ormconfig from './ormconfig';

export const AppDataSource = new DataSource(ormconfig);

if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => console.log('📦 DataSource initialized'))
    .catch((error) => console.error('❌ Error at start datasource', error));
}
