import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToMany, OneToOne, JoinTable } from 'typeorm';
import { Project } from './Project';
import { Song } from './Song';
import { Workflow } from './Workflow';

@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('timestamp')
    startTime: Timestamp;

    @Column('timestamp')
    endTime: Timestamp;

    @Column('timestamp')
    songStartTime: Timestamp;

    @Column('timestamp')
    songEndTime: Timestamp;

    @OneToMany(type => Project, project => project.tracks)
    @JoinTable()
    project: Promise<Project>;

    @OneToMany(type => Song, song => song.tracks)
    @JoinTable()
    song: Promise<Song>;

    @OneToOne(type => Workflow, workflow => workflow.track)
    @JoinTable()
    workflow: Promise<Workflow>;
}
