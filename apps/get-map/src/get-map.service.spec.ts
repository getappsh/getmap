import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GetMapService } from './get-map.service';
import { DeviceEntity, DeviceMapStateEntity, MapConfigEntity, MapEntity, ProductEntity, UploadVersionEntity } from '@app/common/database/entities';
import { LibotHttpClientService } from './http-client.service';
import { ImportCreateService } from './import-create.service';
import { RepoService } from './repo.service';
import { MicroserviceName } from '@app/common/microservice-client';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDiscoveryMessageRepo } from '@app/common/database/test/support/__mocks__';

const mockDiscoveryMicroClient = {
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn().mockResolvedValue({})
}

const mockMicroserviceClient = {
  setClient: jest.fn(),
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn().mockResolvedValue({})
}

describe('GetMapService', () => {
  let getMapService: GetMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMapService,
        ImportCreateService,
        RepoService,
        {
          provide: LibotHttpClientService,
          useValue: {},
        },
        {
          provide: 'DISCOVERY_SERVICE',
          useValue: mockDiscoveryMicroClient
        },
        ConfigService,
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
          useValue:{}
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {}
        },
        {
          provide: getRepositoryToken(MapConfigEntity),
          useValue: {}
        },

      ],
    }).compile();

    getMapService = module.get<GetMapService>(GetMapService);

    jest.clearAllMocks();

  });

  describe('', () => {
    it('', async () => {

    });
  });
})