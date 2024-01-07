import { Validators } from "../utils/validators";
import { ImportAttributes } from "./importAttributes.dto";

export class ImportPayload {
  catalogRecordID: string;
  domain = "RASTER";
  artifactCRS = "4326";
  webhook: Webhook[];
  ROI: Roi;
  description: string;
  keywords: Keywords;
  parameters: Keywords;

  constructor(attrs?: ImportAttributes) {
    if (attrs) {
      this.catalogRecordID = attrs.ProductId
      this.webhook = [
        {
          events: ["TASK_COMPLETED", "TASK_FAILED"],
          url: "callbackUrl"
        }
      ]
      this.ROI = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              maxResolutionDeg: attrs.TargetResolution,
              minResolutionDeg: attrs.MinResolutionDeg
            },
            geometry: Validators.bBoxToPolygon(Validators.bBoxStringToArray(attrs.BoundingBox)).geometry
          }
        ]
      }
      this.description = `Export request for prodID: ${attrs.ProductId} BBox: [${attrs.BBox[0]},${attrs.BBox[1]},${attrs.BBox[2]},${attrs.BBox[3]}] resolution: ${attrs.TargetResolution}`
    }
  }
}

export interface Roi {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Geometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: Array<Array<number[]>>;
}

export interface Properties {
  maxResolutionDeg: number;
  minResolutionDeg: number;
}

export interface Keywords {
  foo: string;
}

export interface Webhook {
  events: string[];
  url: string;
}
