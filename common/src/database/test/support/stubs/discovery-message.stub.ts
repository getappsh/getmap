import { DiscoveryMessageEntity } from "@app/common/database/entities";
import { personalDiscoveryDtoStub, physicalDiscoveryDtoStub, situationalDiscoveryDtoStub } from "@app/root/api/src/modules/device/stubs/dicsocvery/discovery-general.dto.stub";
import { discoverySoftwareDtoStub } from "@app/root/api/src/modules/device/stubs/dicsocvery/discovery-software.dto.stub";

export const discoveryMessageEntityStub = (): DiscoveryMessageEntity => {
  return {
    personalDevice: personalDiscoveryDtoStub(),
    situationalDevice: situationalDiscoveryDtoStub(),
    physicalDevice: physicalDiscoveryDtoStub(),
    discoveryData: discoverySoftwareDtoStub(),
  } as DiscoveryMessageEntity

};