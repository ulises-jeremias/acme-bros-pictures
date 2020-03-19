import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';
import { UserProject } from './UserProject';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    name: string;

    @OneToMany(type => Track, track => track.project)
    tracks: Promise<Track[]>;

    @OneToMany(type => UserProject, projectEmployee => projectEmployee.project)
    projectEmployees: Promise<UserProject[]>;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
