import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable } from 'typeorm';
import { IsString } from 'class-validator';
import { Track } from './Track';

@Entity()
export class Song {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    author: string;

    @ManyToOne(type => Track, track => track.song)
    @JoinTable()
    tracks: Promise<Track[]>;
}
