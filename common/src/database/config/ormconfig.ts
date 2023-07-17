import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UploadVersionEntity, ProjectEntity, MemberProjectEntity, MemberEntity, VersionPackagesEntity, DiscoveryMessageEntity, DeployStatusEntity, PlatformEntity, FormationEntity, CategoryEntity, OperationSystemEntity, DeviceEntity, DeliveryStatusEntity } from '../entities';
import { join } from 'path';
import { readFileSync } from 'fs'


const ormConfig = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,

  ...getDBAuthParams(),
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
    DeviceEntity,
  ],
  migrations: [join(__dirname, '../migration/*.ts')],
  logging: false,
  synchronize: true,
  migrationsTableName: "history",
});

function getDBAuthParams(){
  switch (process.env.DEPLOY_ENV){
    case "CTS" : {
      return {
        ssl: {
          key: [readFileSync(process.env.DB_KEY_PATH)],
          cert: [readFileSync(process.env.DB_CERT_PATH)]
        }      
      }
    }
    default: {
      return {
        password: process.env.POSTGRES_PASSWORD,
      }
    }
  }
}
export default ormConfig;