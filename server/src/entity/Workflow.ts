import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';

@Entity()
export class Workflow {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    @IsString()
    title: string;

    @Column('date')
    expectedStartTime: Date;

    @Column('date')
    startTime?: Date;

    @OneToOne(type => Track, track => track.workflow)
    @JoinTable()
    track: Promise<Track>;
}
