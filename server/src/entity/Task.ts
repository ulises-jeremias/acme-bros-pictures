import { Entity, PrimaryGeneratedColumn, Column, Timestamp, JoinTable, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Workflow } from './Workflow';

export enum TaskStatus {
    TODO = 'todo',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export const taskStatusValues: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.RUNNING,
    TaskStatus.SUCCESS,
    TaskStatus.FAILED,
];

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date')
    startDate?: Timestamp;

    @Column('date')
    endDate?: Timestamp;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @ManyToOne(type => Workflow, workflow => workflow.tasks)
    workflow: Promise<Workflow>;

    @OneToOne(type => Task)
    @JoinColumn()
    next: Task;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
