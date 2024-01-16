import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("map_configs")
export class MapConfigEntity extends BaseEntity {

  @Column({ name: "delivery_timeout", nullable: true })
  deliveryTimeout: number
 
  @Column({ name: "max_map_size_meter", nullable: true})
  maxMapSizeInMeter: number
 
  @Column({ name: "max_parallel_download", nullable: true })
  maxParallelDownloads: number
 
  @Column({ name: "download_retry", nullable: true })
  downloadRetryTime: number
 
  @Column({ name: "download_timeout", nullable: true })
  downloadTimeoutSec: number
 
  @Column({ name: "inventory_job_periodic_mins", nullable: true })
  periodicForInventoryJob: number
  
  @Column({ name: "map_conf_periodic_mins", nullable: true })
  periodicForMapConf: number
 
  @Column({ name: "min_space_byte", nullable: true })
  minSpaceByte: number

  toString(){
    return JSON.stringify(this)
  }
}