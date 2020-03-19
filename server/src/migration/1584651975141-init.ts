import {MigrationInterface, QueryRunner} from "typeorm";

export class init1584651975141 implements MigrationInterface {
    name = 'init1584651975141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "song" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "task_status_enum" AS ENUM('todo', 'running', 'success', 'failed')`, undefined);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "status" "task_status_enum" NOT NULL DEFAULT 'todo', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workflowId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "workflow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "expectedStartDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "trackId" uuid, CONSTRAINT "REL_36228d9988df50edc71de630c1" UNIQUE ("trackId"), CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "songStartTime" character varying NOT NULL, "songEndTime" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, "songId" uuid, "workflowId" uuid, CONSTRAINT "REL_d8530ffcc94345b645a783f0ee" UNIQUE ("workflowId"), CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "user_project_watching_enum" AS ENUM('not-watching', 'releases-only', 'watching', 'ignoring')`, undefined);
        await queryRunner.query(`CREATE TABLE "user_project" ("id" SERIAL NOT NULL, "watching" "user_project_watching_enum" NOT NULL DEFAULT 'watching', "user_id" uuid NOT NULL, "project_id" uuid NOT NULL, CONSTRAINT "PK_7ed533e45a5e62916047614aa0d" PRIMARY KEY ("id", "user_id", "project_id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_4a7490675dae23159db22ddc216" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workflow" ADD CONSTRAINT "FK_36228d9988df50edc71de630c11" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_54cef6d38520a2636c182f8ecca" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_49a3113395b24bcc63a5d270097" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_d8530ffcc94345b645a783f0ee5" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_project" ADD CONSTRAINT "FK_dd66dc6a11849a786759c225537" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_project" ADD CONSTRAINT "FK_9f6abe80cbe92430eaa7a720c26" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_9f6abe80cbe92430eaa7a720c26"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_dd66dc6a11849a786759c225537"`, undefined);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_d8530ffcc94345b645a783f0ee5"`, undefined);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_49a3113395b24bcc63a5d270097"`, undefined);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_54cef6d38520a2636c182f8ecca"`, undefined);
        await queryRunner.query(`ALTER TABLE "workflow" DROP CONSTRAINT "FK_36228d9988df50edc71de630c11"`, undefined);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_4a7490675dae23159db22ddc216"`, undefined);
        await queryRunner.query(`DROP TABLE "project"`, undefined);
        await queryRunner.query(`DROP TABLE "user_project"`, undefined);
        await queryRunner.query(`DROP TYPE "user_project_watching_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "track"`, undefined);
        await queryRunner.query(`DROP TABLE "workflow"`, undefined);
        await queryRunner.query(`DROP TABLE "task"`, undefined);
        await queryRunner.query(`DROP TYPE "task_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "song"`, undefined);
    }

}
