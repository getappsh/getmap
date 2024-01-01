import { OfferingTopics } from '@app/common/microservice-client/topics';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';

@Injectable()
export class OfferingService implements OnModuleInit{
  constructor(@Inject(MicroserviceName.OFFERING_SERVICE) private readonly offeringClient: MicroserviceClient){}


  getOfferingOfComp(catalogId: string) {
    return this.offeringClient.send(OfferingTopics.GET_OFFER_OF_COMP, catalogId)
  }

  async onModuleInit() {
    this.offeringClient.subscribeToResponseOf([OfferingTopics.GET_OFFER_OF_COMP])
    await this.offeringClient.connect()
  }
}
