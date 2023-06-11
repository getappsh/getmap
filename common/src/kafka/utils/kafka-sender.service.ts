import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { Observable, timeout } from "rxjs";

@Injectable()
export class KafkaSenderService {
    private client: ClientKafka;
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


    emit(topic: string, data: any): Observable<any>{
        return this.client.emit(
            topic,
            data
        )
    }
}