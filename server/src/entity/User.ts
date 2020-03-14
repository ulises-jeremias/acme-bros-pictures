const { compare, hash } = require('bcryptjs');

import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Project } from './Project';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid?: string;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column({ unique: true })
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column()
    @IsString()
    name?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToMany(type => Project, project => project.employees)
    @JoinTable()
    projects: Promise<Project[]>;

    public async checkPassword(plainPassword: string): Promise<boolean> {
        return await compare(plainPassword, this.password);
    }

    @BeforeInsert()
    private async _hashPassword?() {
        this.password = await hash(this.password, 10);
    }
}
