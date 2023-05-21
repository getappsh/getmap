import 'dotenv/config';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, VersionPackagesEntity, DiscoveryMessageEntity, DeployStatusEntity, PlatformEntity, FormationEntity, CategoryEntity, OperationSystemEntity } from '../entities';
import { Init1680597327216 } from '../migration/1680597327216-Init';
import { DeliveryStatusEntity } from '../entities/delivery-status.entity';


const ormConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [
    UploadVersionEntity,
    ProjectEntity,
    MemberProjectEntity,
    MemberEntity,
    DiscoveryMessageEntity,
    VersionPackagesEntity,
    DeliveryStatusEntity,
    DeployStatusEntity,
    PlatformEntity,
    FormationEntity,
    CategoryEntity,
    OperationSystemEntity,
  ],
  migrations: [
    // path.resolve(`${__dirname}/../migration/*.ts`),
    Init1680597327216
  ],
  logging: false,
  synchronize: true,
  migrationsTableName: "history",
});
export default ormConfig;