import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';

@Entity()
export class Song {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    author: string;

    @OneToMany(type => Track, track => track.song)
    tracks: Promise<Track[]>;
}
