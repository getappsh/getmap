import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DiscoveryType, Formation, OS } from "./enums.entity";
import { UploadVersionEntity } from "./upload-version.entity";



@Entity("delivery_status")
@Unique('device_id_component_unique_constraint', ['deviceId', 'component'])  
export class DeliverStatusEntity extends BaseEntity{

    @Column({name: "device_id"})
    deviceId: number;
    
    @ManyToOne(() => UploadVersionEntity)
    @JoinColumn()
    component: UploadVersionEntity;

    @Column({name: 'download_start', type: 'timestamp', nullable: true})
    downloadStart: Date;

    @Column({name: 'download_stop', type: 'timestamp', nullable: true})
    downloadStop: Date;

    @Column({name: 'download_done', type: 'timestamp', nullable: true})
    downloadDone: Date;

    @Column({name: "bit_number", nullable: true})
    bitNumber: number;

    @Column({name: "download_speed", nullable: true})
    downloadSpeed: number;

    @Column({name: "download_data", nullable: true})
    downloadData: number;

    @Column({name: 'download_estimate_time', type: 'timestamp', nullable: true})
    downloadEstimateTime: Date;

    @Column({name: 'current_time', type: 'timestamp', nullable: true})
    currentTime: Date;

    toString(){
        return JSON.stringify(this)
    }
}