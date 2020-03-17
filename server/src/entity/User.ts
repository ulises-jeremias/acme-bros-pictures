const { compare, hash } = require('bcryptjs');

import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Project } from './Project';
import { UserProject } from './UserProject';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

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

    @OneToMany(type => UserProject, userProject => userProject.user)
    @JoinTable({
      name: 'user_project',
      joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
      },
      inverseJoinColumn: {
          name: 'project_id',
          referencedColumnName: 'id',
      },
    })
    userProjects: Promise<UserProject[]>;

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
