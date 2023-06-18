import { Entity, Column, Unique, ManyToOne, Generated, ManyToMany, BeforeInsert } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UploadStatus } from "./enums.entity";
import { ProjectEntity } from "./project.entity";
import { ComponentDto } from "apps/api/src/modules/device/dto/discovery/discovery-software.dto";
import {v4 as uuidv4} from 'uuid'

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'version'])
export class UploadVersionEntity extends BaseEntity{

    @Column({name: 'catalog_id', unique: true})
    catalogId: string;
  
    @BeforeInsert()
    generateUUID() {
      this.catalogId = uuidv4();
    }

    @Column({name: "platform"})
    platform: string;

    @Column({name: 'component'})
    component: string

    @Column({name: "formation"})
    formation: string

    @Column({name: 'OS', default: null})
    OS: string;

    @Column ({name: 'virtual_size', default: 0})
    virtualSize: number

    @Column ({name: 'version'})
    version: string

    @Column ({name: 'base_version', default: null})
    baseVersion: string

    @Column ({name: 'prev_version', default: null})
    prevVersion: string

    @Column('jsonb',{name: 'metadata', default: {}})
    metadata: any

    @Column({name: 's3_url', nullable: true})
    s3Url: string

    @Column({
        name: 'upload_status',
        type: "enum",
        enum: UploadStatus,
        default: UploadStatus.STARTED
      })
    uploadStatus: string

    @Column({name: "deployment_status", nullable: true})
    deploymentStatus: string

    @Column({name: "security_status", nullable: true})
    securityStatus: string

    @Column({name: "policy_status", nullable: true})
    policyStatus: string

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    static fromArtifact({platform, component, formation, OS, version, project, size=0, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = platform;
        newVersion.component = component;
        newVersion.formation = formation;
        newVersion.OS = OS;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] || null
        newVersion.prevVersion = metadata['prevVersion'] || null
        newVersion.project = project;
        newVersion.virtualSize = size;
                
        newVersion.metadata = metadata;      

        return newVersion
    }

    static fromManifest({product, name, formation, version, project, url, size=0, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = product;
        newVersion.component = name;
        newVersion.formation = formation;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] || null
        newVersion.prevVersion = metadata['prevVersion'] || null
        newVersion.project = project;
        newVersion.s3Url = url;
        newVersion.virtualSize = size;

        newVersion.metadata = metadata;

        return newVersion;
    }

    toComponentRes(): ComponentDto{
        const compRes = new ComponentDto()
        compRes.name = this.component;
        compRes.versionNumber = this.version;
        compRes.baseVersion = this.baseVersion || "";
        compRes.prevVersion = this.prevVersion || "";
        compRes.catalogId = this.catalogId;
        
        compRes.virtualSize = this.virtualSize;
        
        compRes.category = this.metadata?.category;
        compRes.releaseNotes = this.metadata?.releaseNote;
    
        return compRes
      }

    toString(){
        return JSON.stringify(this)
    }

}