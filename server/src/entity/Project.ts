import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';
import { User } from './User';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    name: string;

    @ManyToOne(type => Track, track => track.project)
    tracks: Promise<Track[]>;

    @ManyToMany(type => User, employee => employee.projects)
    @JoinTable()
    employees: Promise<User[]>;
}
