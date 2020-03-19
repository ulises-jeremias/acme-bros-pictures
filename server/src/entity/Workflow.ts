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
    description: string;

    @Column('date')
    expectedStartDate: Date;

    @OneToOne(type => Track, track => track.workflow)
    @JoinColumn()
    track: Promise<Track>;
    trackId: string;

    @OneToMany(type => Task, task => task.workflow)
    tasks: Promise<Task[]>;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
