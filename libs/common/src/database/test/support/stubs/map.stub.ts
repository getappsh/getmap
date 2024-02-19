import { MapEntity, MapImportStatusEnum } from "@app/common/database/entities";
import { productEntityStubNorthGaza, productEntityStubNorthGazaRecent } from "./product.stub";

export const mapEntityStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id",
    // TODO
    // productId: "map-product-id",
    // productName: "map-product-name",
    fileName: "file-name.ptg",
    zoomLevel: 13,
    createDateTime: new Date("2023-07-19T14:24:54.885Z"),
    boundingBox: "35.71927028,32.01644704,35.72253451,32.01871780",
    packageUrl: "url/to/map/package",
    status: MapImportStatusEnum.START,
  } as MapEntity
}

export const updatedMapFromGazeNorthStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: true,
    mapProduct: productEntityStubNorthGaza()
  } as MapEntity
}

export const obsoleteMapFromGazeNorthStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: false,
    mapProduct: productEntityStubNorthGaza()
  } as MapEntity
}

export const obsoleteMapFromGazeNorthRecentStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: false,
    mapProduct: productEntityStubNorthGazaRecent()
  } as MapEntity
}