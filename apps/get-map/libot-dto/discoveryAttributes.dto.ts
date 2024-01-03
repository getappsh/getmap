import { DiscoveryMapDto } from "@app/common/dto/discovery"
import { ResolutionMapper } from "./resolutionMapper"
import { Validators } from "../utils/validators"

export class DiscoveryAttributes {
  // Identifier: string
  // Creator: string
  // Subject: string
  // Abstract: string
  // Description: string
  // Title: string
  // Type: string

  private _BBox: number[] | null
  private _BoundingBox: string | null
  CRS: string = "urn:x-ogc:def:crs:EPSG:6.11:4326";
  IngestionDate: string
  private _ResolutionDeg: string

  public get BBox() {
    return this._BBox
  }


  public get BoundingBox() {
    return `${this._BBox[0]},${this._BBox[1]},${this._BBox[2]},${this._BBox[3]}`;
  }

  public set BoundingBox(bBox: string) {
    if (Validators.isValidStringForBBox(bBox)) {
      const bBoxValues = Validators.bBoxStringToArray(bBox)
      this._BBox = []
      this._BBox[0] = bBoxValues[0];
      this._BBox[1] = bBoxValues[1];
      this._BBox[2] = bBoxValues[2];
      this._BBox[3] = bBoxValues[3];

      this._BoundingBox = bBox
    } else {
      this._BBox = null
    }
  }

  public get ResolutionDeg() {
    return this._ResolutionDeg
  }

  public set ResolutionDeg(val: string | number) {
    this._ResolutionDeg = ResolutionMapper.level2Resolution(Number(val))
  }

  constructor() {
    this.ResolutionDeg = 17
    this.IngestionDate = process.env.MCCSWRefDate
  }

  toString() {
    return JSON.stringify(this);
  }

  // static fromDiscoverMapDto(dMapDto: DiscoveryMapDto): DiscoveryAttributes {
  //   const attr = new DiscoveryAttributes()
  //   attr.BoundingBox = dMapDto.boundingBox

  //   // attr.Identifier = discoverMap.productId
  //   // attr.Type = discoverMap.productType    

  //   return attr
  // }
}

