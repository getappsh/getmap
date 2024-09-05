import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { BaseEntity } from "./base.entity";
import { OrgUID } from "./org-uid.entity";

@Entity("org_groups")
export class OrgGroupEntity extends BaseEntity {

    @Column({ name: 'name', nullable: false, unique: true })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToMany(type => OrgUID, (uid) => uid.group)
    orgUID: OrgUID[];

    @ManyToOne(type => OrgGroupEntity, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "parent_id" })
    parent: OrgGroupEntity

    @OneToMany(type => OrgGroupEntity, (dvcGrp) => dvcGrp.parent)
    children: OrgGroupEntity[]

}