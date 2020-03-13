const sh = require('shelljs');

import commander from 'commander';
import path from 'path';
import fs from 'fs';

import { Database } from './module/db';
import config from './config';

const database = new Database();

commander.version('0.0.1', '-v --version');

commander
  .command('db:reset')
  .description('Resets database based on NODE_ENV')
  .action(async () => {
    try {
      await database.connect();
      await database.reset();
      await database.disconnect();
      console.log('Database successfully reseted');
    } catch (err) {
      throw new Error(`Cannot reset database. Error: ${err}`);
    }
  });

commander.command('migration:up').action(() => {
  sh.exec(`typeorm migration:run`, (code: any, stdout: any, stderr: any) => {
    if (stderr) {
      console.log('migration error:', stderr);
      return;
    }
    console.log('migration output:', stdout);
  });
});

commander.command('migration:down').action(() => {
  sh.exec(`typeorm migration:revert`, (code: any, stdout: any, stderr: any) => {
    if (stderr) {
      console.log('migration error:', stderr);
      return;
    }
    console.log('migration output:', stdout);
  });
});

commander.command('migration:create <name>').action((name: string) => {
  sh.exec(
    `typeorm migration:create -n ${name}`,
    (code: any, stdout: any, stderr: any) => {
      if (stderr) {
        console.log('migration error:', stderr);
        return;
      }
      console.log('migration output:', stdout);
    },
  );
});

commander.command('migration:generate <name>').action((name: string) => {
  sh.exec(
    `typeorm migration:generate -n ${name}`,
    (code: any, stdout: any, stderr: any) => {
      if (stderr) {
        console.log('migration error:', stderr);
        return;
      }
      console.log('migration output:', stdout);
    },
  );
});

commander.command('prepare:test:db').action(() => {
  try {
    const fileData = `#!/usr/bin/env bash

psql -U postgres -c "CREATE DATABASE ${config.db.name};"
psql -U postgres -c "CREATE USER ${config.db.user} WITH PASSWORD '${config.db.pass}'"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${config.db.name} TO ${config.db.user};"
`;
    fs.writeFileSync(
      path.join(process.cwd(), 'scripts', 'database.sh'),
      fileData,
    );
  } catch (err) {
    throw new Error(`Failed to create a database.config. Error: ${err}`);
  }
});

commander.command('*').action(async () => {
  console.log(
    'No command has been catched please use -h for display all commands',
  );
});

commander.parse(process.argv);
