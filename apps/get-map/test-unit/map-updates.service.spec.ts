import { TestingModule } from '@nestjs/testing';
import { getTestModule } from './get-map-spec.module';
import { MapUpdatesService } from '../src/map-updates.service';
import { productDtoStub } from '@app/common/dto/map/stubs/product.dto.stub';
import { MapEntity } from '@app/common/database/entities';
import { obsoleteMapFromGazeNorthRecentStub, obsoleteMapFromGazeNorthStub, updatedMapFromGazeNorthStub } from '@app/common/database/test/support/stubs/map.stub';

describe('MapUpdatesService', () => {
  let mapUpdatesService: MapUpdatesService;

  beforeAll(async () => {
    const module: TestingModule = await getTestModule().compile();

    mapUpdatesService = module.get<MapUpdatesService>(MapUpdatesService);
  });

  beforeEach(async () => {
    console.count("each")
    jest.clearAllMocks();
  });

  describe('Check maps if are updated or obsolete', () => {
    it('Should save maps as obsolete', async () => {

      const obsoleteMap = obsoleteMapFromGazeNorthStub()
      const updatedMap = updatedMapFromGazeNorthStub()
      const obsoleteMapToBeUpdated = obsoleteMapFromGazeNorthRecentStub()

      const maps = [obsoleteMap, updatedMap, obsoleteMapToBeUpdated]
      const products = productDtoStub()
      const mapObsoleted: MapEntity[] = []
      const mapsUpdated: MapEntity[] = []

      await mapUpdatesService.checkUpdatesByGivenMaps(maps, products, mapObsoleted, mapsUpdated)

      expect(mapObsoleted).toContain<MapEntity>(updatedMap)
      expect(mapObsoleted.every(m => m.isUpdated)).toBe(false)

      expect(mapsUpdated).toContain<MapEntity>(obsoleteMapToBeUpdated)
      expect(mapsUpdated.every(m => m.isUpdated)).toBe(true)
    });
  });
})