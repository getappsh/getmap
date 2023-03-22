import { IsUrl } from "class-validator";
import { Entity, Column, Unique, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProjectEntity } from "./project.entity";

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'version'])
export class UploadVersionEntity extends BaseEntity{
// TODO change db columns to be only the shard columns of artifact and manifest and the rest will bee save as a json
    @Column({name: "platform"})
    platform: string;

    @Column({name: 'component'})
    component: string

    @Column({name: "formation"})
    formation: string

    @Column({name: 'OS', default: "any"})
    OS: string;

    @Column ({name: 'version'})
    version: string

    @Column({name: "release_notes", nullable: true})
    releaseNotes: string

    @Column({name:'base_version', nullable: true})
    baseVersion: string

    @Column({name:'previous_version', nullable: true})
    previousVersion: string

    @Column({name:'size', nullable: true})
    size: string

    @Column({name:'agentTags', nullable: true})
    agent_tags: string

    @Column({name:'install_type', nullable: true})
    installType: string

    @Column({name:'artifact_type', nullable: true})
    artifactType: string

    @Column({name: 'url'})
    @IsUrl()
    url: string 

    @Column({name: "deployment_status", nullable: true})
    deploymentStatus: string

    @Column({name: "security_status", nullable: true})
    securityStatus: string

    @Column({name: "policy_status", nullable: true})
    policyStatus: string

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    fromArtifact(artifactDto: any){
        this.platform = artifactDto.platform;
        this.component = artifactDto.component;
        this.formation = artifactDto.formation;
        this.OS = artifactDto.OS
        this.version = artifactDto.version;
        this.releaseNotes = artifactDto.releaseNotes;
        this.size = artifactDto.size;
        this.url = artifactDto.url;
        this.artifactType = artifactDto.artifactType;
        this.project = artifactDto.project

        return this
    }

    fromManifest(manifest: any){
        this.platform = manifest.product;
        this.component = manifest.name;
        this.formation = manifest.formation;
        this.agent_tags = manifest.agentTags;
        this.version = manifest.version;
        this.previousVersion = manifest.preVersion;
        this.baseVersion = manifest.baseVersion;
        this.installType = manifest.installType;
        this.size = manifest.size;
        this.url = manifest.url;
        this.project = manifest.project;

        // "properties"{
        //     "items":[{"key":"","value":""}]} 
        return this;

    }
    
    toString(){
        return JSON.stringify(this)
    }
 

}