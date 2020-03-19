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

    @Column()
    description: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @ManyToOne(type => Workflow, workflow => workflow.tasks)
    workflow: Promise<Workflow>;
    workflowId: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
