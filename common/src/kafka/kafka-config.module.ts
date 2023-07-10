import { Module } from '@nestjs/common';
import { KafkaProjectManagementConfigService } from './kafka-project-management-config.service';
import { KafkaDeliveryConfigService } from './kafka-delivery-config.service';
import { KafkaDiscoveryConfigService } from './kafka-discovery-config.service';
import { KafkaOfferingConfigService } from './kafka-offering-config.service';
import { KafkaUploadConfigService } from './kafka-upload-config.service';
import { KafkaGetMapConfigService } from './kafka-get-map-config.service';
import { KafkaDeployConfigService } from './kafka-deploy-config.service';
import { KafkaDeviceConfigService } from './kafka-device-config.service';
import { KafkaDeviceMapConfigService } from './kafka-device-map-config.service';


@Module({
  providers: [KafkaUploadConfigService, KafkaDeliveryConfigService, KafkaOfferingConfigService, KafkaDeployConfigService,
    KafkaDiscoveryConfigService, KafkaProjectManagementConfigService, KafkaGetMapConfigService, KafkaDeviceConfigService, 
    KafkaDeviceMapConfigService],
    
  exports: [KafkaUploadConfigService, KafkaDeliveryConfigService, KafkaOfferingConfigService, KafkaDeployConfigService,
    KafkaDiscoveryConfigService, KafkaProjectManagementConfigService, KafkaGetMapConfigService, KafkaDeviceConfigService,
    KafkaDeviceMapConfigService],
})
export class KafkaConfigModule {}


