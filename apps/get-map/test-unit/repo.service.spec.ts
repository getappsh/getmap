import { TestingModule } from '@nestjs/testing';
import { getTestModule } from './mocks/get-map.module.mock';
import { RepoService } from '../src/repo.service';
import { importAttrsStubNorthGazaRecentFull } from '@app/common/dto/map/stubs/importAttrs.dto.stub';
import { mockMapRepo, mockMapRepoProps } from '@app/common/database/test/support/__mocks__';
import { MapEntity, MapImportStatusEnum } from '@app/common/database/entities';
import { resPayloadOnyWithMateData, resPayloadOnlyWithPackageUrl, resPayloadFullComplete } from '@app/common/dto/libot/stubs/import-res-payload.stub';
import { mapEntityStub } from '@app/common/database/test/support/stubs/map.stub';
import { mockHttpClient, mockHttpClientProps } from './mocks/http-client.service.mock';
import { LibotHttpClientService } from '../src/http-client.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RepoService', () => {
  let repoService: RepoService;
  let mapRepo: Repository<MapEntity>;
  let libotService: LibotHttpClientService;
  let module: TestingModule

  beforeAll(async () => {
    module = await getTestModule().compile();
    repoService = module.get<RepoService>(RepoService);
    libotService = module.get<LibotHttpClientService>(LibotHttpClientService);
    mapRepo = module.get<Repository<MapEntity>>(getRepositoryToken(MapEntity))
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('Checks get map from cache', () => {
    it('Should return map as expired', async () => {
      // const mockMapRepo = (repoService as any)['mapRepo'] as mockMapRepoProps;
      jest.spyOn(mapRepo, 'findOne').mockImplementation(mockMapRepo().findOneByImportAttrsAndReturnExpiredMap);

      const map = await repoService.getMapByImportAttrs(importAttrsStubNorthGazaRecentFull())
      expect(map.status).toBe(MapImportStatusEnum.EXPIRED)
    });

    it('Should return map as not expired', async () => {
      const mockMapRepo = (repoService as any)['mapRepo'] as mockMapRepoProps;
      jest.spyOn(mockMapRepo, 'findOne').mockImplementation(mockMapRepo.findOneByImportAttrsAndReturnNotExpiredMap);

      const map = await repoService.getMapByImportAttrs(importAttrsStubNorthGazaRecentFull())
      expect(map.status).not.toBe(MapImportStatusEnum.EXPIRED)
    });

    it('Should return map as expired even the expired data in null', async () => {
      const mockMapRepo = (repoService as any)['mapRepo'] as mockMapRepoProps;
      jest.spyOn(mockMapRepo, 'findOne').mockImplementation(mockMapRepo.findOneByImportAttrsAndReturnWithoutExpiredMap);

      const map = await repoService.getMapByImportAttrs(importAttrsStubNorthGazaRecentFull())
      expect(map.status).toBe(MapImportStatusEnum.EXPIRED)
    });

    it('Should return map as not expired because it in progress ', async () => {
      const mockMapRepo = (repoService as any)['mapRepo'] as mockMapRepoProps;
      jest.spyOn(mockMapRepo, 'findOne').mockImplementation(mockMapRepo.findOneByImportAttrsAndReturnWithoutExpiredMapInProgress);

      const map = await repoService.getMapByImportAttrs(importAttrsStubNorthGazaRecentFull())
      expect(map.status).toBe(MapImportStatusEnum.IN_PROGRESS)
    });
  });

  describe('Checks save map status response', () => {
    beforeEach(() => {
      const mockMapRepo = (repoService as any)['mapRepo'] as mockMapRepoProps;
      jest.spyOn(mockMapRepo, 'find').mockResolvedValue([mapEntityStub()]);
    })

    it('Save map as Done and checks all props if are correct', async () => {
      const mockFootprint = jest.spyOn(libotService, 'getActualFootPrint').mockImplementation(mockHttpClient().getActualFootPrintResolved);


      const resPayload = resPayloadFullComplete()
      const map = mapEntityStub()
      const savedMap = await repoService.saveExportRes(resPayload, map)

      expect(savedMap.jobId).toBe(resPayload.id)
      expect(savedMap.status).toBe(MapImportStatusEnum.DONE)
      expect(savedMap.progress).toBe(100)
      expect(savedMap.exportStart).toEqual(new Date(resPayload.createdAt))
      expect(savedMap.exportEnd).toEqual(new Date(resPayload.finishedAt))
      expect(savedMap.expiredDate).toEqual(new Date(resPayload.expiredAt))
      expect(savedMap.errorReason).toBe(resPayload.errorReason)
      expect(savedMap.packageUrl).toBe(resPayload.artifacts[0].url)
      expect(savedMap.fileName).toBe(resPayload.artifacts[0].name)
      expect(savedMap.size).toBe(resPayload.artifacts[0].size)
      const footprintResult = await mockFootprint.mock.results[0].value
      expect(savedMap.footprint).toBe(footprintResult.coordinates.join(","))
    });

    it('Save map as in progress because footprint is null', async () => {
      const resPayload = resPayloadOnlyWithPackageUrl()
      const map = mapEntityStub()
      const savedMap = await repoService.saveExportRes(resPayload, map)

      expect(savedMap.status).toBe(MapImportStatusEnum.IN_PROGRESS)
    });

    it('Save map as in progress because packageUrl is null', async () => {
      jest.spyOn(libotService, 'getActualFootPrint').mockImplementation(mockHttpClient().getActualFootPrintResolved);
      const resPayload = resPayloadOnyWithMateData()
      const map = mapEntityStub()
      const savedMap = await repoService.saveExportRes(resPayload, map)

      expect(savedMap.status).toBe(MapImportStatusEnum.IN_PROGRESS)
    });

    it('Save map as Error because footprint req is reject', async () => {
      jest.spyOn(libotService, 'getActualFootPrint').mockImplementation(mockHttpClient().getActualFootPrintRejected);
      const resPayload = resPayloadOnyWithMateData()
      const map = mapEntityStub()
      const savedMap = await repoService.saveExportRes(resPayload, map)

      expect(savedMap.status).toBe(MapImportStatusEnum.ERROR)
    });
  });

})