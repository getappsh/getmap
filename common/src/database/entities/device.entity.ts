import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("device")
export class DeviceEntity {
    
    @PrimaryColumn({name: 'ID'})
    ID: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    lastUpdatedDate: Date;

    @Column({name: 'MAC', nullable: true})
    MAC: string;

    @Column({name: 'IP', nullable: true})
    IP: string;

    @Column({name: 'OS', nullable: true})
    OS: string;

    @Column({name: 'serial_number', nullable: true})
    serialNumber: string;

    @Column({name: 'possible_bandwidth', nullable: true})
    possibleBandwidth: string;

    @Column({name: 'available_storage', nullable: true})
    availableStorage: string

}