import { MapEntity, DeviceEntity, DeviceMapStateEntity, ProductEntity, MapConfigEntity } from "@app/common/database/entities";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LibotHttpClientService } from "../src/http-client.service";
import { ImportCreateService } from "../src/import-create.service";
import { RepoService } from "../src/repo.service";
import { JobsEntity } from "@app/common/database/entities/map-updatesCronJob";
import { mockMapConfigRepo } from "@app/common/database/test/support/__mocks__/map-config.repo.mock";
import { GetMapService } from "../src/get-map.service";
import { MapUpdatesService } from "../src/map-updates.service";

const mockDiscoveryMicroClient = {
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn().mockResolvedValue({})
}

export const getTestModule = () => {
  return Test.createTestingModule({
    providers: [
      GetMapService,
      ImportCreateService,
      RepoService,
      ConfigService,
      {
        provide: 'DISCOVERY_SERVICE',
        useValue: mockDiscoveryMicroClient
      },
      {
        provide: LibotHttpClientService,
        useValue: {},
      },
      {
        provide: MapUpdatesService,
        useValue: {},
      },
      {
        provide: LibotHttpClientService,
        useValue: {},
      },
      {
        provide: getRepositoryToken(MapEntity),
        useValue: {}
      },
      {
        provide: getRepositoryToken(DeviceEntity),
        useValue: {}
      },
      {
        provide: getRepositoryToken(DeviceMapStateEntity),
        useValue: {}
      },
      {
        provide: getRepositoryToken(ProductEntity),
        useValue: {}
      },
      {
        provide: getRepositoryToken(MapConfigEntity),
        useValue: mockMapConfigRepo()
      },
      {
        provide: getRepositoryToken(JobsEntity),
        useValue: {}
      },

    ],
  })
}