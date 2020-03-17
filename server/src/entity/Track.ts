import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project';
import { Song } from './Song';
import { Workflow } from './Workflow';

@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('timestamp')
    startTime: Timestamp;

    @Column('timestamp')
    endTime: Timestamp;

    @Column('timestamp')
    songStartTime: Timestamp;

    @Column('timestamp')
    songEndTime: Timestamp;

    @OneToMany(type => Project, project => project.tracks)
    project: Promise<Project>;

    @OneToMany(type => Song, song => song.tracks)
    song: Promise<Song>;

    @OneToOne(type => Workflow, workflow => workflow.track, { cascade: ['update'] })
    @JoinColumn()
    workflow: Promise<Workflow>;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
