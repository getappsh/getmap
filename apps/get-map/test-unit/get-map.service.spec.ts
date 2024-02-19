import { TestingModule } from '@nestjs/testing';
import { GetMapService } from '../src/get-map.service';
import { getTestModule } from './get-map-spec.module';

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