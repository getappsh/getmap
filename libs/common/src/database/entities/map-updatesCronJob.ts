import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: "map_updates_cron_job_time"})
export class MapUpdatesJobEntity{
  
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({name: "start_time", precision: 0 })
  @Unique(["start_time"])
  time: Date
}