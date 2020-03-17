import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';
import { User } from './User';
import { UserProject } from './UserProject';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    name: string;

    @ManyToOne(type => Track, track => track.project)
    tracks: Promise<Track[]>;

    @OneToMany(type => UserProject, projectEmployee => projectEmployee.project)
    projectEmployees: Promise<UserProject[]>;

    @ManyToMany(type => User, employee => employee.projects)
    employees: Promise<User[]>;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
