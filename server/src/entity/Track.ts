import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './Project';
import { Song } from './Song';
import { Workflow } from './Workflow';

@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    startTime: String;

    @Column()
    endTime: String;

    @Column()
    songStartTime: String;

    @Column()
    songEndTime: String;

    @ManyToOne(type => Project, project => project.tracks)
    project: Promise<Project>;
    projectId: string;

    @ManyToOne(type => Song, song => song.tracks)
    song: Promise<Song>;
    songId: string;

    @OneToOne(type => Workflow, workflow => workflow.track)
    @JoinColumn()
    workflow: Promise<Workflow>;
    workflowId: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
