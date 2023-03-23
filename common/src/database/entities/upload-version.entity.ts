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

    static fromArtifact(artifactDto: any){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = artifactDto.platform;
        newVersion.component = artifactDto.component;
        newVersion.formation = artifactDto.formation;
        newVersion.OS = artifactDto.OS
        newVersion.version = artifactDto.version;
        newVersion.releaseNotes = artifactDto.releaseNotes;
        newVersion.size = artifactDto.size;
        newVersion.url = artifactDto.url;
        newVersion.artifactType = artifactDto.artifactType;
        newVersion.project = artifactDto.project

        return newVersion
    }

    static fromManifest(manifest: any){
        const newVersion = new UploadVersionEntity()

        newVersion.platform = manifest.product;
        newVersion.component = manifest.name;
        newVersion.formation = manifest.formation;
        newVersion.agent_tags = manifest.agentTags;
        newVersion.version = manifest.version;
        newVersion.previousVersion = manifest.preVersion;
        newVersion.baseVersion = manifest.baseVersion;
        newVersion.installType = manifest.installType;
        newVersion.size = manifest.size;
        newVersion.s3Url = manifest.url;
        newVersion.project = manifest.project;

        // "properties"{
        //     "items":[{"key":"","value":""}]} 
        return newVersion;

    }
    
    toString(){
        return JSON.stringify(this)
    }
 

}