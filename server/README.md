# ACME BROS Pictures API

AVAILABLE ENDPOINTS

| method             | resource         | description                                                                                    |
|:-------------------|:-----------------|:-----------------------------------------------------------------------------------------------|
| `GET`              | `/`              | Simple welcome response                                                                        |
| `GET`              | `/swagger`       | Swagger documentation                                                                                               |    

## Pre-reqs

To build and run this app locally you will need:
- Install [Node.js](https://nodejs.org/en/)

## Features:

 * Nodemon - server auto-restarts when code changes
 * Koa v2
 * TypeORM (SQL DB) with basic CRUD included
 * Class-validator - Decorator based entities validation
 * Node-input-validator - Node Input Validator is a validation library for node.js.
 * Jest - Test framework

## Included middleware:

 * koa-router
 * koa-bodyparser
 * koa-response-time
 * koa-compress
 * koa-static
 * swagger-ui-koa
 * swagger-jsdoc
 * Helmet (security headers)
 * CORS
 * Winston Logger

# Getting Started

- Clone the repository

```sh
$ git clone https://github.com/ulises-jeremias/acme-bros-pictures.git
```

- Install dependencies

```sh
$ cd acme-bros-pictures/server
$ yarn
```

- Run the project directly in TS

```sh
$ yarn dev
```

- Build and run the project in JS

``` sh
$ yarn build
$ yarn start
```

- Run tests in the project

```sh
$ yarn test
```

- Run tests and coverage in the project

```sh
$ yarn coverage
```

## Setting up the Database - ORM

This API is prepared to work with an SQL database, using [TypeORM](https://github.com/typeorm/typeorm). In this case we are using postgreSQL, and that is why in the package.json 'pg' has been included.

In local is being mocked with the docker local postgres as can be seen in ".env.sample"

It is importante to notice that, when serving the project directly with *.ts files using ts-node,the configuration for the ORM should specify the *.ts files path, but once the project is built (transpiled) and run as plain js, it will be needed to change it accordingly to find the built js files:

```json
    "entities": [
      "dist/entity/**/*.js"
   ],
   "migrations": [
      "dist/migration/**/*.js"
   ],
   "subscribers": [
      "dist/subscriber/**/*.js"
   ]
```

Notice that if `NODE_ENV` is set to development, the ORM config won't be using SSL to connect to the DB. Otherwise it will.

```ts
createConnection({
    ...
    extra: {
        ssl: config.DbSslConn, // if not development, will use SSL
    }
})
```

## Environment variables

Create a .env file (or just rename the .env.sample) containing all the env variables you want to set, dotenv library will take care of setting them. This project is using three variables at the moment:

 * PORT -> port where the server will be started on. Default: **`3000`**.
 * NODE_ENV -> environment, development value will set the logger as debug level. Possible options: development, test, production. Default: **development**.
 * DB_USER -> Database user. Default: **`postgres`**.
 * DB_PASS -> Database password. Default: **`postgres`**.
 * DB_HOST -> Database host. Default: **`localhost`**.
 * DB_PORT -> Database port. Default: **`5432`**.
 * DB_NAME -> Database name. Default: **`postgres`**.
 
## Project Structure

The most obvious difference in a TypeScript + Node project is the folder structure.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `yarn build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your yarn dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **test**                 | Contains all test files
| index.ts                 | Entry point to your KOA app                                                                   |
| package.json             | File that contains yarn dependencies as well as build scripts                                  |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tslint.json              | Config settings for TSLint code style checking                                                |
| .env.sample              | Env variables file example to be renamed to .env                                              |

## Configuring TypeScript compilation

TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled. 

```json
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "lib": ["es2017"],
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "noImplicitAny": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "includes": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
```

| `compilerOptions` | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"module": "commonjs"`             | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use            |
| `"target": "es2017"`               | The output language level. Node supports ES2017, so we can target that here                               |
| `"lib": ["dom","es2017","es6"]`    | Needed for TypeORM.                                             |
| `"moduleResolution": "node"`       | TypeScript attempts to mimic Node's module resolution strategy.                            |
| `"sourceMap": true`                | We want source maps to be output along side our JavaScript.     |
| `"outDir": "dist"`                 | Location to output `.js` files after compilation                |
| `"rootDir": "src"`                 | List of root folders whose combined content represents the structure of the project at runtime.                      |
| `"noImplicitAny": true`            | Raise error on expressions and declarations with an implied 'any' type.                                 |   
| `"experimentalDecorators": true`   | Needed for TypeORM. Allows use of @Decorators                   |
| `"emitDecoratorMetadata": true`    | Needed for TypeORM. Allows use of @Decorators                   |

The rest of the file define the TypeScript project context.
The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context: 
```json
    "include" : [
        "src/**/*"
    ]
```
`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.

## Running the build

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `build`                   | Compiles all source `.ts` files to `.js` files in the `dist` folder                    |
| `clean`                   | Does the same as 'yarn clean:build'.    |
| `start`                   | Runs node on `dist/index.js` which is the apps entry point                                |
| `dev`                     | Nodemon, process restarts if crashes. Continuously watches `.ts` files and re-compiles to `.js`   |
| `lint`                    | Runs TSLint on project files                                                                      |
| `test`                    | Runs all tests in the project    |
| `covarage`                | Runs all tests and coverage in the project |
| `clean:build`             | Removes all `.js` files in the `dist` folder |
| `ci`                      | Runs TSLint and all test in the project | 

# Docker

## build image

```sh
$ docker build -t {image_name} .
```

## run container

In the Docker, you can run any script from the Running the build section

```sh
$ docker run -d [-p {your_port}:3000] [-e key=value] [-v {your_app_directory}:/usr/src/app] -t {image_name} [{script}]
```

| Flag | Description |
| ---------------| --------------------|
| `-v {your_app_directory}:/usr/src/app` | Mounting your home folder with the code for development |
| `-p {your_port}:3000`                  | Port mounting. Default: **`3000`**     |
| `-e key=value`                         | Environment variables |
| `{script}`                             | Run script in container. Default: **`start`** |

# TSLint

TSLint is a code linter which mainly helps catch minor code quality and style issues.
TSLint is very similar to ESLint or JSLint but is built with TypeScript in mind.

## TSLint rules

Like most linters, TSLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `tslint.json`.
In this project, we are using a fairly basic set of rules with no additional custom rules.
The settings are largely based off the TSLint settings that we use to develop TypeScript itself.

## Running TSLint

Like the rest of our build steps, we use yarn scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.

```sh
$ yarn build   // runs full build including TSLint
$ yarn tslint  // runs only TSLint
```

# Running TEST

Like the rest of the steps, we use yarn scripts to call test.

```
$ yarn ci       // runs TSLint including all test
$ yarn test     // runs only test
$ yarn covarage // runs all test including covarage
```

## Jest configuration

Jest's configuration can be defined in the package.json file of your project:

| Options | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"testEnvironment": "node"`         | The test environment that will be used for testing.  |
| `"moduleFileExtensions": ["js","jsx","json","ts","tsx"]` | An array of file extensions your modules use. |
| `"transform": {"\\.ts$": "ts-jest"}`| A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files. |
| `"testRegex"`| The pattern Jest uses to detect test files. |
| `"testPathIgnorePatterns": ["/node_modules/","/dist/","/coverage/"]`| An array of regexp pattern strings that are matched against all test paths before executing the test. If the test path matches any of the patterns, it will be skipped. |
