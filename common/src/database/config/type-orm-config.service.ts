import { Inject, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import path from "path";
import { DataSource } from "typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory{
    createTypeOrmOptions():  TypeOrmModuleOptions{
        return{
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD, 
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true, 
            synchronize: true, ///////// not for production
            logging: false,
            entities: [path.resolve(`${__dirname}/../entities/**.entity.ts`)],
            migrations: [
                path.resolve(`${__dirname}/../migration/*{.ts,.js}`),
            ],
            
        };
    }
}