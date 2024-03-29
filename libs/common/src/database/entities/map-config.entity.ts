import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("map_configs")
export class MapConfigEntity extends BaseEntity {

  @Column({ name: "delivery_timeout_mins", nullable: true })
  deliveryTimeoutMins: number

  @Column({ name: "max_map_area_sq_km", nullable: true })
  MaxMapAreaSqKm: number

  @Column({ name: "max_map_size_MB", nullable: true })
  maxMapSizeInMB: number

  @Column({ name: "max_parallel_download", nullable: true })
  maxParallelDownloads: number

  @Column({ name: "download_retry_time", nullable: true })
  downloadRetryTime: number

  @Column({ name: "download_timeout_mins", nullable: true })
  downloadTimeoutMins: number

  @Column({ name: "inventory_job_periodic_mins", nullable: true })
  periodicInventoryIntervalMins: number

  @Column({ name: "map_conf_periodic_mins", nullable: true })
  periodicConfIntervalMins: number

  @Column({ name: "matomo_periodic_mins", nullable: true })
  periodicMatomoIntervalMins: number

  @Column({ name: "min_space_mb", nullable: true })
  minAvailableSpaceMB: number

  @Column({ name: "map_min_inclusion_in_percentages", nullable: true })
  mapMinInclusionInPercentages: number

  @Column({ name: "matomo_url", nullable: true })
  matomoUrl: string

  @Column({ name: "matomo_dimension_id", nullable: true })
  matomoDimensionId: string

  @Column({ name: "matomo_site_id", nullable: true })
  matomoSiteId: string

  toString() {
    return JSON.stringify(this)
  }
}