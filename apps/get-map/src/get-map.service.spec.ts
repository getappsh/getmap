import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GetMapService } from './get-map.service';
import { UploadVersionEntity } from '@app/common/database/entities';
import { LibotHttpClientService } from './http-client.service';
import { ImportCreateService } from './import-create.service';
import { RepoService } from './repo.service';

describe('GetMapService', () => {
  // let getMapService: GetMapService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       GetMapService,
  //       LibotHttpClientService,
  //       ImportCreateService,
  //       RepoService
  //     ],
  //   }).compile();

  //   getMapService = module.get<GetMapService>(GetMapService);

  //   jest.clearAllMocks();

  // });

  describe('', () => {
    it('', async () => {

    });
  });
})