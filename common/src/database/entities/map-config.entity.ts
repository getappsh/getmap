import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class MapConfigEntity extends BaseEntity {

  @Column({ name: "delivery_timeout" })
  deliveryTimeout: number
 
  @Column({ name: "max_map_size_meter", type: "bigint"})
  maxMapSizeInMeter: number
 
  @Column({ name: "max_parallel_download" })
  maxParallelDownloads: number
 
  @Column({ name: "download_retry" })
  downloadRetryTime: number
 
  @Column({ name: "download_timeout" })
  downloadTimeoutSec: number
 
  @Column({ name: "inventory_job_periodic_mins" })
  periodicForInventoryJob: number
  
  @Column({ name: "map_conf_periodic_mins" })
  periodicForMapConf: number
 
  @Column({ name: "min_space_byte", type: "bigint" })
  minSpaceByte: number

  toString(){
    return JSON.stringify(this)
  }
}