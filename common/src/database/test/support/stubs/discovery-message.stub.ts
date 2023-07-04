import { DiscoveryMessageEntity } from "@app/common/database/entities";
import { personalDiscoveryDtoStub, situationalDiscoveryDtoStub } from "@app/root/api/src/modules/device/stubs/dicsocvery/discovery-general.dto.stub";
import { discoverySoftwareDtoStub } from "@app/root/api/src/modules/device/stubs/dicsocvery/discovery-software.dto.stub";
import { deviceEntityStub } from "./device.stub";

export const discoveryMessageEntityStub = (): DiscoveryMessageEntity => {
  return {
    device: deviceEntityStub(),
    personalDevice: personalDiscoveryDtoStub(),
    situationalDevice: situationalDiscoveryDtoStub(),
    discoveryData: discoverySoftwareDtoStub(),
  } as DiscoveryMessageEntity

};