import { Inject, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import * as path from "path";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{
    createTypeOrmOptions():  TypeOrmModuleOptions{
        console.log(path.resolve(`${__dirname}/../../../libs/common/src/database/entities/*.entity.ts`))
        console.log(__dirname)

        return{
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD, 
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true, 
            synchronize: false, ///////// not for production
            logging: false,
            entities: [path.resolve(`${__dirname}/../../../libs/common/src/database/entities/*.entity.ts`)],
            migrations: [
                path.resolve(`${__dirname}/../migration/*{.ts,.js}`),
            ],
            
        };
    }
}