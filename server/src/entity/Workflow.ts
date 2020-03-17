import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

    @OneToMany(type => Task, task => task.workflow, { cascade: ['insert', 'update'] })
    tasks: Promise<Task[]>;

    @OneToOne(type => Task, task => task.workflow, { cascade: ['update'] })
    @JoinColumn()
    current: Promise<Task>;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
