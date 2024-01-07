import { LibotExportStatusEnum } from "@app/common/database/entities/enums.entity";
import { ImportPayload } from "./import-payload";

export class ImportResPayload extends ImportPayload {
  id: number;
  estimatedSize: number;
  estimatedTime: number;
  status: LibotExportStatusEnum
  errorReason: string;
  progress: number
  artifacts: Artifact[]
  createdAt: string
  expiredAt: string
  finishedAt: string

  constructor(data: ImportResPayload) {    
    super();
    this.catalogRecordID = data.catalogRecordID
    this.domain = data.domain
    this.artifactCRS = data.artifactCRS
    this.webhook = data.webhook
    this.ROI = data.ROI
    this.description = data.description
    this.keywords = data.keywords
    this.parameters = data.parameters

    this.id = data.id
    this.estimatedSize = data.estimatedSize
    this.estimatedTime = data.estimatedTime
    this.status = data.status
    this.errorReason = data.errorReason
    this.progress = data.progress
    this.artifacts = data.artifacts
    this.createdAt = data.createdAt
    this.expiredAt = data.expiredAt
    this.finishedAt = data.finishedAt
  }
}

interface Artifact {
  type: ArtifactsLibotEnum,
  name: string,
  size: number
  url: string
}

export enum ArtifactsLibotEnum {
  GPKG = "GPKG",
  LEGEN = "LEGEND",
  METADAT = "METADATA",
  THUMBNAILS_SMALL = "THUMBNAILS_SMALL",
  THUMBNAILS_MEDIUM = "THUMBNAILS_MEDIUM",
  THUMBNAILS_LARG = "THUMBNAILS_LARGE"
}