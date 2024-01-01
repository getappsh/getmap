import { Module } from '@nestjs/common';
import { DiscoveryService } from './discovery/discovery.service';
import { DiscoveryController } from './discovery/discovery.controller';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { DeviceController } from './device/device.controller';
import { DeviceService } from './device/device.service';

@Module({
  controllers: [DiscoveryController, GroupController, DeviceController],
  providers: [DiscoveryService, GroupService, DeviceService]
})
export class DeviceModule {}
