import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { UploadVersionEntity } from "./upload-version.entity";
import { OfferingAction } from "./enums.entity";
import { BaseEntity } from "./base.entity";


@Entity("component_offering")
export class ComponentOfferingEntity extends BaseEntity{


  @ManyToOne(() => DeviceEntity, { nullable: false })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => UploadVersionEntity, { nullable: false })
  @JoinColumn({ name: "component_catalog_id" })
  component: UploadVersionEntity;

  @Column({ name: "action", type: "enum", enum: OfferingAction, default: OfferingAction.OFFERING })
  action: OfferingAction
}