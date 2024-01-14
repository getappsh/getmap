import { ResolutionMapper } from "./utils/resolutionMapper"
import { Validators } from "./utils/validators"

export class DiscoveryAttributes {

  private _BBox: [number, number, number, number]
  // private _BoundingBox: string | null
  CRS: string = "urn:x-ogc:def:crs:EPSG:6.11:4326";
  IngestionDate: string
  private _ResolutionDeg: number

  public get BBox() {
    return this._BBox
  }


  public get BoundingBoxToSting() {
    return `${this._BBox[0]},${this._BBox[1]},${this._BBox[2]},${this._BBox[3]}`;
  }

  public set BoundingBox(bBox: [number, number, number, number]) {
    this._BBox = bBox
  }

  public get ResolutionDeg() {
    return this._ResolutionDeg
  }

  public set ResolutionDeg(val: string | number) {
    this._ResolutionDeg = ResolutionMapper.level2Resolution(Number(val))
  }

  constructor() {
    this.ResolutionDeg = (process.env.TARGET_RESOLUTION) ?? 17
    this.IngestionDate = process.env.MC_CSW_REF_DATE
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

