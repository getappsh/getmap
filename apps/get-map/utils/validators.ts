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

  static bBoxStringToArray(bBox: string): number[] {
    return bBox.split(",").map(val => Number(val.trim())).filter(val => !isNaN(val));
  }
}