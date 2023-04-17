import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DiscoveryType, Formation, OS } from "./enums.entity";



@Entity("discovery_message")
export class DiscoveryMessageEntity extends BaseEntity{

    @Column('jsonb', {name: "personal_device", nullable: true})
    personalDevice: any;

    @Column('jsonb', {name: "situational_device", nullable: true})
    situationalDevice: any;

    @Column('jsonb', {name: "physical_device", nullable: true})
    physicalDevice: any;

    @Column({type: "enum", enum: DiscoveryType})
    discoveryType: DiscoveryType;

    // @Column({type: "enum", enum: Formation})
    formation: string;

    @Column('jsonb', {name: "base_version", nullable: true})
    baseVersion: any;

    @Column('jsonb', {name: "previous_version", nullable: true})
    previousVersion: any;

    

    @Column('jsonb', {name: "map", nullable: true})
    map: any;

    
}