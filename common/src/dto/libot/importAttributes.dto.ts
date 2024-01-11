import { CreateImportDto } from "@app/common/dto/map"
import { Validators } from "./utils/validators"

export class ImportAttributes {
  ProductId: string
  private readonly _BBox: number[] = []
  private _BoundingBox: string
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

  public get BoundingBox() {
    return `${this._BBox[0]},${this._BBox[1]},${this._BBox[2]},${this._BBox[3]}`;
  }

  public set BoundingBox(bBox: string) {
    
    if (!Validators.isValidStringForBBox(bBox)) {
      throw new Error("Bounding box values are invalid.");
    }
    
    const bBoxValues = Validators.bBoxStringToBboxArray(bBox)    
    this._BBox[0] = bBoxValues[0];
    this._BBox[1] = bBoxValues[1];
    this._BBox[2] = bBoxValues[2];
    this._BBox[3] = bBoxValues[3];
    
    this._BoundingBox = bBox
  }

  static fromImportCreateDto(importDto: CreateImportDto): ImportAttributes {
    const attr = new ImportAttributes()
    attr.ProductId = importDto.mapProperties.productId    
    attr.BoundingBox = importDto.mapProperties.boundingBox
    attr.ZoomLevel = importDto.mapProperties.zoomLevel

    return attr
  }
}

