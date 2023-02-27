import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";
import { Components, Formation } from "./enums.entity";

@Entity('upload_version')
@Unique('component_formation_version_unique_constraint', ['component', 'formation', 'baseVersion'])
export class UploadVersionEntity{

    @PrimaryGeneratedColumn()
    id: number;

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

    @Column()
    url: string 

    @CreateDateColumn()
    createDate: Date

    toString(){
        return JSON.stringify(this)
    }


}