import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { BaseEntity } from "./base.entity";

@Entity("devices_group")
@Unique('group_name_in_group_unique_constraint', ['name', 'parent'])  
export class DevicesGroupEntity extends BaseEntity{

    @Column({name: 'name', nullable: false})
    name: string;

    @Column({name: 'description', nullable: true})
    description: string;

    @OneToMany(type => DeviceEntity, (device) => device.groups)
    devices: DeviceEntity[];

    @ManyToOne(type => DevicesGroupEntity, {nullable: true})
    parent: DevicesGroupEntity

    @OneToMany(type => DevicesGroupEntity, (dvcGrp) => dvcGrp.parent)
    children: DevicesGroupEntity[]
    
}