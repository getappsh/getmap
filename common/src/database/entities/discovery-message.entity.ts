import { Component } from "apps/api/src/modules/discovery/dto/discoveryMessage.dto";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Formation, OS } from "./enums.entity";



@Entity("discovery_message")
export class DiscoveryMessageEntity extends BaseEntity{
    
    @Column({name: "mac"})
    mac: string
    @Column({name: "agent_id"})
    agentId: string
    @Column({name: "ip"})
    ip: string
    @Column({type: "enum", enum: OS})
    OS: string
    @Column({type: "enum", enum: Formation})
    formation: string
    @Column('jsonb', {name: "versions", nullable: true})
    versions: Component[]

}