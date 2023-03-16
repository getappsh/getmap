import { IsUrl } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Components, Formation } from "./enums.entity";
import { ProjectEntity } from "./project.entity";

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'baseVersion'])
export class UploadVersionEntity extends BaseEntity{

    @Column({name: "platform", default: "test"})
    platform: string;

    // component represents operation system
    @Column({
        type: "enum",
        enum: Components,
    })
    component: string

    @Column({
        type: "enum",
        enum: Formation
    })
    formation: string

    @Column({name:'base_version'})
    baseVersion: string

    @Column({name:'previous_version'})
    previousVersion: string

    @Column({name: "deployment_status", default: null})
    deploymentStatus: string

    @Column({name: "security_status", default: null})
    securityStatus: string

    @Column({name: "policy_status", default: null})
    policyStatus: string

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    @Column()
    @IsUrl()
    url: string 

    toString(){
        return JSON.stringify(this)
    }


}