import { bbox, bboxPolygon, booleanWithin, multiPolygon, polygon } from "@turf/turf";
import { Footprint, FootprintType } from "@app/common/dto/libot/footprint";

export class Validators {

  static isBBoxAreaValid(bBox: number[]): boolean {
    const bboxArea = Math.abs(bBox[2] - bBox[0]) * Math.abs(bBox[3] - bBox[1]);
    const maxArea = Number(process.env.MAX_BBOX_AREA_4_EXPORT) ?? 0.01
    return bboxArea < 0 || bboxArea <= maxArea
  }

  static isValidStringForBBox(bBox: string): boolean {
    const bBoxValues: number[] = this.bBoxStringToArray(bBox)
    return bBoxValues !== null && bBoxValues.length === 4
  }

  static bBoxStringToArray(bBox: string): [number, number, number, number] {
    //  return bBox.split(",").map(val => Number(val.trim())).filter(val => !isNaN(val));

    const bbox = bBox.split(",").map(val => Number(val.trim())).filter(val => !isNaN(val));
    return [
      Math.min(bbox[0], bbox[2]),
      Math.min(bbox[1], bbox[3]),
      Math.max(bbox[0], bbox[2]),
      Math.max(bbox[1], bbox[3])
    ]
  }

  static footprintToObj(footprint: string): number[] {
    return JSON.parse(footprint)
  }

  static bBoxToPolygon(bbox:[number, number, number, number]){
    return bboxPolygon(bbox)
  }

  static isBBoxInFootprint(bBox: string, footprint: string): boolean {
    const fp = new Footprint(footprint)
    const fpPoly = fp.type === FootprintType.POLYGON ? polygon(fp.coordinates) : multiPolygon(fp.coordinates)
    const bBoxPolygon = this.bBoxToPolygon(this.bBoxStringToArray(bBox))
    const fpBBox = bboxPolygon(bbox(fpPoly))
    return booleanWithin(bBoxPolygon, JSON.parse(footprint))
  }
}