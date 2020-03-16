import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn } from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity('user_project')
export class UserProject {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    isActive: boolean;

    @ManyToMany(type => User, user => user.projects, { primary: true })
    @JoinTable()
    user: User;

    @ManyToMany(type => Project, project => project.employees, { primary: true })
    @JoinTable()
    project: Project;
}