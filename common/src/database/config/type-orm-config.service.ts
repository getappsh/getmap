import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

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
            logging: false
        };
    }
}  