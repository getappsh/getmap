import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DeliveryStatusEnum } from "./enums.entity";
import { UploadVersionEntity } from "./upload-version.entity";



@Entity("delivery_status")
// @Unique('device_id_component_unique_constraint', ['deviceId', 'component'])  
export class DeliveryStatusEntity extends BaseEntity{

    @Column({name: "device_id"})
    deviceId: string;
    
    @ManyToOne(() => UploadVersionEntity)
    @JoinColumn({
        name: "component_catalog_id",
        referencedColumnName: "catalogId"
    })
    component: UploadVersionEntity;

    
    @Column({
        name: 'delivery_status',
        type: "enum",
        enum: DeliveryStatusEnum,
        default: DeliveryStatusEnum.START
      })
    deliveryStatus: DeliveryStatusEnum

    @Column({name: 'download_start', type: 'timestamp', nullable: true})
    downloadStart: Date;

    @Column({name: 'download_stop', type: 'timestamp', nullable: true})
    downloadStop: Date;

    @Column({name: 'download_done', type: 'timestamp', nullable: true})
    downloadDone: Date;

    @Column({name: "bit_number", nullable: true})
    bitNumber: number;

    @Column({name: "download_speed", type: 'decimal', nullable: true})
    downloadSpeed: number;

    @Column({name: "download_data", type: 'decimal', nullable: true})
    downloadData: number;

    @Column({name: 'download_estimate_time', nullable: true})
    downloadEstimateTime: number;

    @Column({name: 'current_time', type: 'timestamp', nullable: true})
    currentTime: Date;

    toString(){
        return JSON.stringify(this)
    }
}