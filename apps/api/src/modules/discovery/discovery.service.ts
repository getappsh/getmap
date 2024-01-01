import { OfferingTopics, DiscoveryTopics } from '@app/common/microservice-client/topics';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';

@Injectable()
export class DiscoveryService implements OnModuleInit {

  constructor(@Inject(MicroserviceName.DISCOVERY_SERVICE) private readonly discoveryClient: MicroserviceClient) {
     }

  checkUpdates(discoveryMessage: DiscoveryMessageDto) {
    return this.discoveryClient.send(OfferingTopics.CHECK_UPDATES, discoveryMessage)
  }

  discoveryMessage(discoveryMessage: DiscoveryMessageDto) {
    this.discoveryClient.emit(DiscoveryTopics.DISCOVERY_MESSAGE, discoveryMessage)
  }

  async onModuleInit() {
    this.discoveryClient.subscribeToResponseOf([OfferingTopics.CHECK_UPDATES])
    await this.discoveryClient.connect()
  }
}
