import { registerAs } from '@nestjs/config';
import { environment } from './environment';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseConfig = {
  type: 'postgres',
  host: `${environment.db.HOST}`,
  port: environment.db.PORT,
  username: `${environment.db.USER}`,
  password: `${environment.db.PASSWORD}`,
  database: `${environment.db.NAME}`,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/infra/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
} as DataSourceOptions;

export default registerAs('typeorm', () => databaseConfig);
export const connectionSource = new DataSource(databaseConfig);
