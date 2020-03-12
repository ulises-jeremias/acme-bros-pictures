import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
import config from '../config';

const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
    type: 'postgres',
    host: config.db.host,
    port: config.db.port as number,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    entities: [`${parentDir}/model/entity/**/*{.ts,.js}`],
    migrations: [`${parentDir}/model/migration/**/*{.ts,.js}`],
    subscribers: [`${parentDir}/model/subscriber/**/*{.ts,.js}`],
    cli: {
        entitiesDir: `${parentDir}/model/entity`,
        migrationsDir: `${parentDir}/model/migration`,
        subscribersDir: `${parentDir}/model/subscriber`
    },
    synchronize: false,
    logging: !config.isProduction,
    extra: {
        ssl: config.db.dbsslconn, // if not development, will use SSL
    }
};

interface IDatabase {
    connect(): Promise<Connection>;
    disconnect(): Promise<void>;
    reset(): any;
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
    }

    public async runMigrations() {
        await this.connection.runMigrations();
    }

    public async dropDatabase() {
        await this.connection.dropDatabase();
    }
}
