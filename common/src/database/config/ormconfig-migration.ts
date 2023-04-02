import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import {UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, VersionPackagesEntity, DiscoveryMessageEntity } from '../entities/';
// import { c1680166034719 } from '../migration/1680166034719-c';
import { $npmConfigName1680167272216 } from '../migration/1680167272216-$npm_config_name';

console.log(path.resolve(`libs/common/src/database/migration/*{.ts,.js}`))
const config = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, DiscoveryMessageEntity, VersionPackagesEntity],
  migrations: [
    path.resolve(`${__dirname}/../migration/*.ts`),
    'libs/common/src/database/migration/c1680166034719.ts',
    path.resolve(`libs/common/src/database/migration/c1680166034719.ts`)
  ],
  logging: true,
  synchronize: false,
  migrationsTableName: "history",
});
export default config;