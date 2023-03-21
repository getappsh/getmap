import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';

console.log(path.resolve(`${__dirname}/../migration/*{.ts,.js}`))
console.log(path.resolve(`${__dirname}/../entities/**.entity{.ts,.js}`))
const config = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.resolve(`${__dirname}/../entities/**.entity.ts`)],
  migrations: [
    path.resolve(`${__dirname}/../migration/*{.ts,.js}`),
  ],
  // migrationsTableName: 'migrations',
  logging: true,
  synchronize: false,
});
export default config;