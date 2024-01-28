import { Test, TestingModule } from '@nestjs/testing';
import { DeviceEntity, DeviceMapStateEntity, MapConfigEntity, MapEntity, ProductEntity } from '@app/common/database/entities';
import { LibotHttpClientService } from './http-client.service';
import { ImportCreateService } from './import-create.service';
import { RepoService } from './repo.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productDtoStub } from '@app/common/dto/map/stubs/product.dto.stub';
import { importAttrsStubNoProduct, importAttrsStubNorthGazaMoreThen60Pres, importAttrsStubNorthGazaRecentMoreThen60Pres as importAttrsStubNorthGazaRecentMoreThen60Perc } from '@app/common/dto/map/stubs/importAttrs.dto.stub';
import { Validators } from '@app/common/dto/map/utils/validators';

describe('ImportCreateService', () => {
  let importCreateService: ImportCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportCreateService,
        RepoService,
        ConfigService,
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
          useValue: {}
        },

      ],
    }).compile();

    importCreateService = module.get<ImportCreateService>(ImportCreateService);

    jest.clearAllMocks();

  });

  describe('extract the most compatible product', () => {
    let getIntersectPercentage: jest.SpyInstance; // To check how much map inclusion the product has
    let isBBoxIntersectFootprint: jest.SpyInstance; // A way to check how many iterators it went through

    beforeEach(() => {
      getIntersectPercentage = jest.spyOn(Validators, "getIntersectPercentage")
      isBBoxIntersectFootprint = jest.spyOn(Validators, "isBBoxIntersectFootprint")
    })

    it('should return no intersect with any product ', async () => {
      const productDto = productDtoStub()
      const importAttrs = importAttrsStubNoProduct()

      const selectedProduct = await importCreateService.extractMostCompatibleProduct(productDto, importAttrs)

      expect(getIntersectPercentage).toBeCalledTimes(0)
      expect(isBBoxIntersectFootprint).toBeCalledTimes(productDto.length)
      expect(selectedProduct).toBeUndefined()

    });

    it('should return the first product of the list ', async () => {
      const productDto = productDtoStub()
      const importAttrs = importAttrsStubNorthGazaRecentMoreThen60Perc()

      const selectedProduct = await importCreateService.extractMostCompatibleProduct(productDto, importAttrs)

      expect(isBBoxIntersectFootprint).toBeCalledTimes(1)
      const percResult = getIntersectPercentage.mock.results
      expect(percResult[percResult.length - 1].value).toBeGreaterThan(60)
      expect(selectedProduct).toEqual(productDto[0])
    });

    it('should return the north Gaza product from the list ', async () => {
      const productDto = productDtoStub()
      const importAttrs = importAttrsStubNorthGazaMoreThen60Pres()

      const selectedProduct = await importCreateService.extractMostCompatibleProduct(productDto, importAttrs)
      expect(isBBoxIntersectFootprint).toBeCalledTimes(3)
      const percResult = getIntersectPercentage.mock.results
      expect(percResult[0].value).toBeLessThan(60)
      expect(getIntersectPercentage).toBeCalledTimes(2)
      expect(percResult[getIntersectPercentage.mock.calls.length - 1].value).toBeGreaterThanOrEqual(60)
      expect(selectedProduct).toEqual(productDto[2])
    });
  });
})