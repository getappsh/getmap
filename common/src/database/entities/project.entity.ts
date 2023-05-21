import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MemberProjectEntity } from "./member_project.entity";
import { MemberEntity } from "./member.entity";


@Entity("project")
export class ProjectEntity extends BaseEntity{
    
    @Index("project_component_name_unique_constraint", {unique: true})
    @Column({name: "component_name"})
    componentName: string;

    @Column({name: "OS", default: null})
    OS: string;

    @Column({name: "platform_type", default: null})
    platformType: string;

    @Column({name: "formation", default: null})
    formation: string;

    @Column({name: "artifact_type", default: null})
    artifactType: string;

    @Column({name: "category", default: null})
    category: string;

    @Column({name: "description"})
    description: string
    
    @Column('simple-array', {name: "tokens", nullable: true})
    tokens: string[]
   
    @OneToMany(() => MemberProjectEntity, memberProject => memberProject)
    memberProject: MemberProjectEntity[];

    toString(){
        return JSON.stringify(this)
    }
}