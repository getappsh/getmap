import { Column, Entity, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MemberProjectEntity } from "./member_project.entity";


@Entity("project")
export class ProjectEntity extends BaseEntity{
    
    @Index("project_name_unique_constraint", {unique: true})
    @Column({name: "name"})
    name: string

    @Column({name: "description"})
    description: string

    @Column('simple-array', {name: "tokens", nullable: true, array: true})
    tokens: string[]

    @OneToMany(() => MemberProjectEntity, memberProject => memberProject)
    memberProject: MemberProjectEntity[];

    toString(){
        return JSON.stringify(this)
    }
}