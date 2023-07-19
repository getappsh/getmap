import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DeliveryStatusEnum, DeliveryTypeEnum, DeployStatusEnum } from "./enums.entity";
import { UploadVersionEntity } from "./upload-version.entity";
import { DeviceEntity } from "./device.entity";



@Entity("deploy_status")
// @Unique('device_id_component_unique_constraint', ['deviceId', 'component'])  
export class DeployStatusEntity extends BaseEntity{

    @ManyToOne(() => DeviceEntity)
    @JoinColumn()
    device: DeviceEntity

    @Column({name: 'catalogId', nullable: false})
    catalogId: string;
    
    @Column({
        name: 'status',
        type: "enum",
        enum: DeployStatusEnum,
        default: DeliveryStatusEnum.START
      })
    deployStatus: DeployStatusEnum

    @Column({
        name: 'type',
        type: "enum",
        enum: DeliveryTypeEnum,
        default: DeliveryTypeEnum.SOFTWARE
      })
    type: DeliveryTypeEnum

    @Column({name: 'deploy_start', type: 'timestamp', nullable: true})
    deployStart: Date;

    @Column({name: 'deploy_stop', type: 'timestamp', nullable: true})
    deployStop: Date;

    @Column({name: 'deploy_done', type: 'timestamp', nullable: true})
    deployDone: Date;

    @Column({name: 'deploy_estimate_time', nullable: true})
    deployEstimateTime: number;

    @Column({name: 'current_time', type: 'timestamp', nullable: true})
    currentTime: Date;

    toString(){
        return JSON.stringify(this)
    }
}