import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { MapImportStatusEnum } from "./enums.entity";
import { DeviceEntity } from "./device.entity";

@Entity("map")
export class MapEntity {

  @PrimaryColumn({ name: 'request_id' })
  requestId: string;

  @Column({ name: 'product_id', nullable: true })
  productId: string;

  @Column({ name: 'product_name', nullable: true })
  productName: string;

  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @Column({ name: 'zoom_level', nullable: true })
  zoomLevel: number;

  @Column({ name: 'create_date', nullable: true })
  createDate: Date;

  @Column({ name: 'bounding_box', nullable: true })
  boundingBox: string;

  @Column({ name: 'url', nullable: true })
  url: string;

  @Column({
     name: 'status',
     type: "enum",
     enum: MapImportStatusEnum,
     default: MapImportStatusEnum.START,
    })
  status: MapImportStatusEnum;

  @ManyToMany(() => DeviceEntity, deviceEntity => deviceEntity.maps)
  devices: DeviceEntity[]

  toString(){
    return JSON.stringify(this)
  }
}
