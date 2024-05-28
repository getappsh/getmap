
import { PrepareDeliveryReqDto } from "@app/common/dto/delivery";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { DeliveryItemEntity } from "./delivery-item.entity";
import { PrepareStatusEnum } from "../../database/entities/enums.entity";

@Entity("delivery")
export class DeliveryEntity {

  @PrimaryColumn({ name: "catalog_id" })
  catalogId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  lastUpdatedDate: Date;

  @Column({ name: "device_id" })
  deviceId: string;

  @Column({
    name: 'status',
    type: "enum",
    enum: PrepareStatusEnum,
    default: PrepareStatusEnum.START
  })
  status: PrepareStatusEnum;

  @Column({ name: "err_msg", nullable: true })
  errMsg: string;

  @Column({ name: "size", nullable: true })
  size: number;

  @OneToMany(() => DeliveryItemEntity, item => item.delivery)
  items: DeliveryItemEntity[];


  static fromPrepDlvReqDto(prepDlv: PrepareDeliveryReqDto): DeliveryEntity {
    let dlv = new DeliveryEntity()
    dlv.catalogId = prepDlv.catalogId;
    dlv.deviceId = prepDlv.deviceId;

    return dlv;
  }
}