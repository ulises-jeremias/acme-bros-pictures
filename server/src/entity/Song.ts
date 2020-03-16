import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

    @ManyToOne(type => Track, track => track.song)
    tracks: Promise<Track[]>;
}
