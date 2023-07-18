import { BadRequestException, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Observable, timeout, map } from "rxjs";

@Injectable()
export class KafkaSenderService {
    private client: ClientKafka;
    private readonly logger = new Logger(KafkaSenderService.name);

    constructor(private configService: ConfigService){}


    setClient(client: ClientKafka){
        this.client = client;
    }


    send(topic: string, data: any, waitTime?: number ): Observable<any>{
        waitTime = (waitTime) ? waitTime : parseInt(this.configService.get("MICROSERVICE_RESPONSE_WAIT_TIME"))
        return this.client.send(
            topic,
            data
        ).pipe(
            timeout(waitTime)
        )
    }

    sendAndValidate<T extends Object>(topic: string, data: any, ClassConstructor: ClassConstructor<T>, waitTime?: number): Observable<Promise<T>>{
        waitTime = (waitTime) ? waitTime : parseInt(this.configService.get("MICROSERVICE_RESPONSE_WAIT_TIME"))
        return this.client.send(
            topic,
            data
        ).pipe(
            timeout(waitTime),
            map(async res => {
                const validationObject = plainToInstance(ClassConstructor, res);
                const errors = await validate(validationObject);
                if (errors.length > 0) {
                    this.logger.log(`Validation error for response of topic: ${topic}`);
                    const constraints = errors.map((error) => Object.values(error.constraints ?? {})).flat();
                    this.logger.debug(`error list: ${errors}`);
                    throw new BadRequestException(constraints);
                }
                return res;
            })
        )
    }

     emit(topic: string, data: any): Observable<any>{
        return this.client.emit(
            topic,
            data
        )
    }
}