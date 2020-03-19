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

@Entity('user_project')
export class UserProject {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'enum', enum: Watching, default: Watching.WATCHING })
    watching: Watching;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(type => User, user => user.userProjects, { primary: true, eager: true })
    user: User;

    @JoinColumn({ name: 'project_id' })
    @ManyToOne(type => Project, project => project.projectEmployees, { primary: true, eager: true })
    project: Project;
}