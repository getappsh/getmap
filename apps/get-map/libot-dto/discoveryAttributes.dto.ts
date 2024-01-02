import { DiscoveryMapDto } from "@app/common/dto/discovery"
import { ResolutionMapper } from "./resolutionMapper"

export class DiscoveryAttributes {
  Identifier: string
  Creator: string
  Subject: string
  Abstract: string
  Description: string
  Title: string
  Type: string
  BoundingBox: string
  CRS: string = "urn:x-ogc:def:crs:EPSG:6.11:4326";
  IngestionDate: string
  ResolutionDeg: string

  toString() {
    return JSON.stringify(this);
  }

  static fromDiscoverMapDto(discoverMap: DiscoveryMapDto): DiscoveryAttributes {
    const attr = new DiscoveryAttributes()
    attr.BoundingBox = discoverMap.boundingBox
    attr.Identifier = discoverMap.productId
    attr.Type = discoverMap.productType
    attr.ResolutionDeg = ResolutionMapper.level2Resolution(17)
    attr.IngestionDate = process.env.MCCSWRefDate

    return attr
  }
}

