import { Column, Entity, Index, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Components, Formation, PackageStatus } from "./enums.entity";
import { IsValidStringFor } from './../../validators';

@Entity("version_packages")
// @Unique(["OS", "formation", "fromVersion", "toVersion"])
@Index(["OS", "formation", "fromVersion", "toVersion"], { unique: true }) // Here

export class VersionPackagesEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: Components,
  })
  OS: string

  @Column({
    type: "enum",
    enum: Formation
  })
  formation: string

  @Column({name: "from_version"})
  @IsValidStringFor("version")
  fromVersion: string
  
  @Column({name: "to_version"})
  @IsValidStringFor("version")
  toVersion: string

  @Column({
    type: "enum",
    enum: PackageStatus,
    default: PackageStatus.IN_RPOGRESS
  })
  status:string
  
}