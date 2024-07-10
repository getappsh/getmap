import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OS, Formation, PackageStatus } from "./enums.entity";
import { IsValidStringFor } from './../../validators';
import { IsUrl } from "class-validator";
import { Pattern } from "@app/common/validators/regex.validator";

@Entity("version_packages")
// @Unique(["OS", "formation", "fromVersion", "toVersion"])
@Index(["OS", "formation", "fromVersion", "toVersion"], { unique: true }) // Here

export class VersionPackagesEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: OS
  })
  OS: string

  @Column({
    type: "enum",
    enum: Formation
  })
  formation: string

  @Column({name: "from_version"})
  // @IsValidStringFor(Pattern.VERSION)
  fromVersion: string
  
  @Column({name: "to_version"})
  // @IsValidStringFor(Pattern.VERSION)
  toVersion: string

  @Column({
    type: "enum",
    enum: PackageStatus,
    default: PackageStatus.IN_PROGRESS
  })
  status:string

  @Column({nullable: true, default: null})
  @IsUrl()
  utl:string
  
} 