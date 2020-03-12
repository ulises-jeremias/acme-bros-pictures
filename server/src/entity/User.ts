import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;
}
