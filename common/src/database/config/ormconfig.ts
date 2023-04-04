import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import {UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, VersionPackagesEntity, DiscoveryMessageEntity } from '../entities';


const ormConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, DiscoveryMessageEntity, VersionPackagesEntity],
  migrations: [
    // path.resolve(`${__dirname}/../migration/*.ts`),
  ],
  logging: false,
  synchronize: true,
  migrationsTableName: "history",
});
export default ormConfig;