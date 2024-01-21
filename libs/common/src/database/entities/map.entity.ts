import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { MapImportStatusEnum } from "./enums.entity";
import { ProductEntity, } from "./map-product.entity";
import { DeviceMapStateEntity } from "./device-map-state.entity";
import { nanoid } from "nanoid";

@Entity("map")
export class MapEntity {

  @PrimaryColumn({ name: 'catalog_id' })
  catalogId: string;

  @BeforeInsert()
  generateCatalogId() {
    this.catalogId = nanoid();
  }

  @CreateDateColumn({ name: 'create_date' })
  createDateTime: Date;

  @UpdateDateColumn()
  lastUpdatedDate: Date;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: "map_product" })
  mapProduct: ProductEntity

  @Column({ name: 'zoom_level', nullable: true })
  zoomLevel: number;

  @Column({ name: 'max_resolution', type: "float8", nullable: true })
  maxResolutionDeg: number;

  @Column({ name: 'bounding_box', nullable: true })
  boundingBox: string;

  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @Column({ name: 'package_url', nullable: true })
  packageUrl: string;

  @Column({
    name: 'status',
    type: "enum",
    enum: MapImportStatusEnum,
    default: MapImportStatusEnum.START,
  })
  status: MapImportStatusEnum;

  @Column({ name: 'progress', type: 'int', nullable: true })
  progress: number

  @Column({ name: 'size', type: 'int', nullable: true })
  size: number

  @Column({ name: 'export_start', type: 'timestamptz', nullable: true })
  exportStart: Date

  @Column({ name: 'export_end', type: 'timestamptz', nullable: true })
  exportEnd: Date

  @Column({ name: 'job_id', type: "bigint", nullable: true })
  jobId: number

  @Column({ name: 'error_reason', nullable: true })
  errorReason: string

  @Column({ name: 'is_updated', type: "boolean", default: true })
  isUpdated: boolean

  @Column({ name: 'last_check is_obsolete', type: "timestamptz", nullable: true })
  lastCheckIsObsolete: Date

  @OneToMany(() => DeviceMapStateEntity, deviceMapStateEntity => deviceMapStateEntity.map, { cascade: true })
  devices: DeviceMapStateEntity[]

  toString() {
    return JSON.stringify(this)
  }
}
