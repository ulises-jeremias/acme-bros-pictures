import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';

export enum Watching {
    NOT_WATCHING = 'not-watching',
    RELEASES_ONLY = 'releases-only',
    WATCHING = 'watching',
    IGNORING = 'ignoring',
}

export const watchingOptions: Watching[] = [
    Watching.NOT_WATCHING,
    Watching.RELEASES_ONLY,
    Watching.WATCHING,
    Watching.IGNORING,
];

@Entity('user_projects_project')
export class UserProject {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'enum', enum: Watching, default: Watching.WATCHING })
    watching: Watching;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(type => User, user => user.projects, { primary: true })
    user: User;

    @JoinColumn({ name: 'project_id' })
    @ManyToOne(type => Project, project => project.employees, { primary: true })
    project: Project;
}