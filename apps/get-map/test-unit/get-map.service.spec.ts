import { TestingModule } from '@nestjs/testing';
import { GetMapService } from '../src/get-map.service';
import { getTestModule } from './mocks/get-map.module.mock';

describe('GetMapService', () => {
  let getMapService: GetMapService;

  beforeEach(async () => {
    const module: TestingModule = await getTestModule().compile();

    getMapService = module.get<GetMapService>(GetMapService);

    jest.clearAllMocks();

  });

  describe('', () => {
    it('', async () => {

    });
  });
})