import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("map_configs")
export class MapConfigEntity extends BaseEntity {

  @Column({ name: "delivery_timeout", nullable: true })
  deliveryTimeoutMins: number

  @Column({ name: "max_map_size_meter", nullable: true })
  maxMapSizeInMeter: number

  @Column({ name: "max_map_size_MB", nullable: true })
  maxMapSizeInMB: number

  @Column({ name: "max_parallel_download", nullable: true })
  maxParallelDownloads: number

  @Column({ name: "download_retry", nullable: true })
  downloadRetryTime: number

  @Column({ name: "download_timeout", nullable: true })
  downloadTimeoutMins: number

  @Column({ name: "inventory_job_periodic_mins", nullable: true })
  periodicInventoryIntervalMins: number

  @Column({ name: "map_conf_periodic_mins", nullable: true })
  periodicConfIntervalMins: number

  @Column({ name: "min_space_byte", nullable: true })
  minAvailableSpaceBytes: number

  @Column({ name: "matomo_url", nullable: true })
  matomoUrl: string

  toString() {
    return JSON.stringify(this)
  }
}