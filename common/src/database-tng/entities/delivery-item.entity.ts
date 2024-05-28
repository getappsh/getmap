
import { BaseEntity } from "../../database/entities/base.entity";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";
import { PrepareStatusEnum } from "../../database/entities/enums.entity";

@Entity("delivery_item")
@Unique(['itemKey', 'delivery'])
export class DeliveryItemEntity extends BaseEntity {

  @Column({ name: "item_key" })
  itemKey: string;

  @Column({ name: "meta_data", nullable: true })
  metaData: string;

  @ManyToOne(() => DeliveryEntity, delivery => delivery.items, { onDelete: 'CASCADE' })
  delivery: DeliveryEntity;

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

  @Column({ name: "path", nullable: true })
  path: string;

  @Column({ name: "progress", type: "int", default: 0 })
  progress: number

}