import { Entity, Column, Unique, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProjectEntity } from "./project.entity";

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'version'])
export class UploadVersionEntity extends BaseEntity{
    @Column({name: "platform"})
    platform: string;

    @Column({name: 'component'})
    component: string

    @Column({name: "formation"})
    formation: string

    @Column({name: 'OS', default: null})
    OS: string;

    @Column ({name: 'version'})
    version: string

    @Column('jsonb',{name: 'metadata', default: {}})
    metadata: any

    @Column({name: 's3_url', nullable: true})
    s3Url: string

    @Column({name: "deployment_status", nullable: true})
    deploymentStatus: string

    @Column({name: "security_status", nullable: true})
    securityStatus: string

    @Column({name: "policy_status", nullable: true})
    policyStatus: string

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    static fromArtifact({platform, component, formation, OS, version, project, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = platform;
        newVersion.component = component;
        newVersion.formation = formation;
        newVersion.OS = OS;
        newVersion.version = version;
        newVersion.project = project;
                
        newVersion.metadata = metadata;      

        return newVersion
    }

    static fromManifest({product, name, formation, version, project, url, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = product;
        newVersion.component = name;
        newVersion.formation = formation;
        newVersion.version = version;
        newVersion.project = project;
        newVersion.s3Url = url;

        newVersion.metadata = metadata;

        return newVersion;
    }
    
    toString(){
        return JSON.stringify(this)
    }

}