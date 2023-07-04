import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DiscoveryType, Formation, OS } from "./enums.entity";
import { DeviceEntity } from "./device.entity";



@Entity("discovery_message")
export class DiscoveryMessageEntity extends BaseEntity{

    @ManyToOne(() => DeviceEntity)
    @JoinColumn()
    device: DeviceEntity;

    @Column('jsonb', {name: "personal_device", nullable: true})
    personalDevice: any;

    @Column('jsonb', {name: "situational_device", nullable: true})
    situationalDevice: any;

    @Column('jsonb', {name: "discovery_data", nullable: true})
    discoveryData: any;

    @Column({type: "enum", enum: DiscoveryType})
    discoveryType: DiscoveryType;

    @Column('jsonb', {name: "map", nullable: true})
    map: any;


    toString(){
        return JSON.stringify(this)
    }
    
}