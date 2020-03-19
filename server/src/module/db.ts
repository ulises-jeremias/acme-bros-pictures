import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions, EntitySchema, Table } from 'typeorm';
import path from 'path';
import config from '../config';

const parentDir = path.join(__dirname, '..');

export const connectionOpts: ConnectionOptions = {
    type: 'postgres',
    host: config.db.host,
    port: config.db.port as number,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    entities: [`${parentDir}/entity/**/*{.ts,.js}`],
    migrations: [`${parentDir}/migration/**/*{.ts,.js}`],
    subscribers: [`${parentDir}/subscriber/**/*{.ts,.js}`],
    cli: {
        entitiesDir: `${parentDir}/entity`,
        migrationsDir: `${parentDir}/migration`,
        subscribersDir: `${parentDir}/subscriber`
    },
    synchronize: true, // !config.isProduction,
    logging: !config.isProduction,
    extra: {
        ssl: config.db.dbSslConn, // if not development, will use SSL
    }
};

interface IDatabase {
    connect(): Promise<Connection>;
    disconnect(): Promise<void>;
    reset(): any;
    createTable(schema: string | Function | EntitySchema<any>): Promise<void>;
}

export class Database implements IDatabase {
    private connection: Connection;

    public async connect(): Promise<Connection> {
        if (this.connection) {
            await this.connection.connect();
            return this.connection;
        }
        this.connection = await createConnection(connectionOpts);
        return this.connection;
    }

    public async disconnect(): Promise<void> {
        if (this.connection.isConnected) {
            await this.connection.close();
        }
    }

    public async reset() {
        await this.connection.dropDatabase();
        await this.connection.runMigrations();
        await this.connection.showMigrations();
    }

    public async runMigrations() {
        await this.connection.runMigrations();
    }

    public async dropDatabase() {
        await this.connection.dropDatabase();
    }

    public async createTable(schema: string | Function | EntitySchema<any>) {
        const queryRunner = this.connection.createQueryRunner();
        const metadata = this.connection.getMetadata(schema);
        const newTable = Table.create(metadata, this.connection.driver);
        await queryRunner.createTable(newTable);
    }
}
