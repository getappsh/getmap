import { CreateImportDto } from "@app/common/dto/map"
import { Validators } from "./utils/validators"
import { Feature, bbox, bboxPolygon, polygon } from "@turf/turf"

export class ImportAttributes {
  ProductId: string
  pattern: "bbox" | "polygon"
  private _BBox: [number, number, number, number];
  private _Polygon: Feature;
  private _pointsString: string
  ZoomLevel: number
  TargetResolution: number
  MinResolutionDeg: number
  FileName: string
  RequestId: string
  JobId: string

  toString() {
    return JSON.stringify(this);
  }

  public get BBox() {
    return this._BBox
  }

  public get Polygon() {
    return this._Polygon
  }

  public get Points() {
    return this._pointsString
  }

  public set Points(bBox: string) {
    let poly: number[][] | false
    if (Validators.isValidStringForBBox(bBox)) {
      this._pointsString = bBox
      this.setBBoxString(bBox)
      this._Polygon = bboxPolygon(this._BBox)
      this.pattern = "bbox"
    } else if ((poly = Validators.isValidStringForPolygon(bBox))) {
      this._pointsString = bBox
      const fePoly = polygon([poly])
      this._Polygon = fePoly
      this._BBox = bbox(fePoly) as [number, number, number, number]
      this.pattern = "polygon"
    } else {
      throw new Error("Points box values are invalid.");
    }
    // this._BoundingBox = bBox
  }

  setBBoxString(bBox: string) {
    const bBoxValues = Validators.bBoxStringToBboxArray(bBox)
    let bbox = [] as unknown as [number, number, number, number];
    bbox[0] = bBoxValues[0];
    bbox[1] = bBoxValues[1];
    bbox[2] = bBoxValues[2];
    bbox[3] = bBoxValues[3];
    this._BBox = bbox
  }

  static fromImportCreateDto(importDto: CreateImportDto): ImportAttributes {
    const attr = new ImportAttributes()
    attr.Points = importDto.mapProperties.boundingBox
    return attr
  }
}

