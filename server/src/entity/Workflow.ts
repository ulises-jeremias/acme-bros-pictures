import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';
import { Task } from './Task';

@Entity()
export class Workflow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column('date')
    expectedStartDate: Date;

    @Column('date')
    startDate?: Date;

    @OneToOne(type => Track, track => track.workflow)
    @JoinColumn()
    track: Promise<Track>;

    @OneToMany(type => Task, task => task.workflow, { cascade: ['insert'] })
    tasks: Promise<Task[]>
}
