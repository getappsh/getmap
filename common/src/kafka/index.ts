import { ClientsModule } from "@nestjs/microservices"
import { KafkaConfigModule } from "./kafka-config.module"
import { KafkaProjectManagementConfigService } from "./kafka-project-management-config.service"
import { KafkaDeliveryConfigService } from "./kafka-delivery-config.service"
import { KafkaDiscoveryConfigService } from "./kafka-discovery-config.service"
import { KafkaOfferingConfigService } from "./kafka-offering-config.service"
import { KafkaUploadConfigService } from "./kafka-upload-config.service"
import { KafkaGetMapConfigService } from "./kafka-get-map-config.service"
import { KafkaDeployConfigService } from "./kafka-deploy-config.service"
import { KafkaDeviceConfigService } from "./kafka-device-config.service"
import { KafkaDeviceMapConfigService } from "./kafka-device-map-config.service"

export const KafkaUploadModule = ClientsModule.registerAsync([{
  name: 'UPLOAD_SERVICE',
  useExisting: KafkaUploadConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaDeliveryModule = ClientsModule.registerAsync([{
  name: 'DELIVERY_SERVICE',
  useExisting: KafkaDeliveryConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaOfferingModule = ClientsModule.registerAsync([{
  name: 'OFFERING_SERVICE',
  useExisting: KafkaOfferingConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaDiscoveryModule = ClientsModule.registerAsync([{
  name: 'DISCOVERY_SERVICE',
  useExisting: KafkaDiscoveryConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaDeployModule = ClientsModule.registerAsync([{
  name: 'DEPLOY_SERVICE',
  useExisting: KafkaDeployConfigService,
  imports: [KafkaConfigModule]
}])


export const KafkaDashboardModule = ClientsModule.registerAsync([{
  name: 'PROJECT_MANAGEMENT_SERVICE',
  useExisting: KafkaProjectManagementConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaGetMapModule = ClientsModule.registerAsync([{
  name: 'GET_MAP_SERVICE',
  useExisting: KafkaGetMapConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaDeviceModule = ClientsModule.registerAsync([{
  name: 'DEVICE_SERVICE',
  useExisting: KafkaDeviceConfigService,
  imports: [KafkaConfigModule]
}])

export const KafkaDeviceMapModule = ClientsModule.registerAsync([{
  name: 'DEVICE_MAP_SERVICE',
  useExisting: KafkaDeviceMapConfigService,
  imports: [KafkaConfigModule]
}])