import { MapEntity, DeviceEntity, DeviceMapStateEntity, ProductEntity, MapConfigEntity } from "@app/common/database/entities";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LibotHttpClientService } from "../../src/http-client/http-client.service";
import { ImportCreateService } from "../../src/import-create.service";
import { RepoService } from "../../src/repo.service";
import { JobsEntity } from "@app/common/database/entities/map-updatesCronJob";
import { mockMapConfigRepo } from "@app/common/database/test/support/__mocks__/map-config.repo.mock";
import { GetMapService } from "../../src/get-map.service";
import { MapUpdatesService } from "../../src/map-updates.service";
import { mockMapRepo } from "@app/common/database/test/support/__mocks__";
import { mockHttpClient } from "./http-client.service.mock";
import { HttpClientModule } from "../../src/http-client/http-client.module";

const mockDiscoveryMicroClient = {
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn().mockResolvedValue({})
}

export const getTestModule = () => {
  return Test.createTestingModule({
    imports:[HttpClientModule.forRoot({isEmulator: false})],
    providers: [
      GetMapService,
      ImportCreateService,
      MapUpdatesService,
      RepoService,
      ConfigService,
      {
        provide: 'DISCOVERY_SERVICE',
        useValue: mockDiscoveryMicroClient
      },
      {
        provide: LibotHttpClientService,
        useValue: mockHttpClient(),
      },
      {
        provide: getRepositoryToken(MapEntity),
        useValue: mockMapRepo(),
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