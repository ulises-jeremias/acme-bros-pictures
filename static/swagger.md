# acme-bros-pictures-api
REST API using NodeJS and Koa2, Typescript. TypeORM with class-validator, SQL CRUD. Docker.

## Version: 1.0.0

### Terms of service


### /auth/login

#### POST
##### Summary:

Logs user into the system.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| username | body | The user name for login | Yes | string |
| password | body | The password for login in clear text | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | string |
| 400 | Invalid username/password supplied |  |

### /auth/me

#### GET
##### Summary:

Access profile info.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [User](#user) |
| 401 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /

#### GET
##### Summary:

The welcome string is returned.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | welcome message |

### /projects

#### GET
##### Summary:

Access projects for the connected user.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Project](#project) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### POST
##### Summary:

Create the project.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| name | body | The project name | Yes | string |
| employees | body | The employees | Yes | [ [User](#user) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Successful operation | [Project](#project) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /projects/{id}

#### GET
##### Summary:

Access project data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The project identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Project](#project) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /projects/{id}/tracks

#### GET
##### Summary:

Access tracks for the given project.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The project identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Track](#track) ] |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /songs

#### GET
##### Summary:

Access available songs.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Song](#song) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /tasks

#### GET
##### Summary:

Access tasks for the connected user.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Task](#task) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### POST
##### Summary:

Create the task for the given track.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| workflowId | body | The workflow identifier | Yes | string |
| description | body | The task description | Yes | string |
| status | body | The task status | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Successful operation | [Task](#task) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /tasks/{id}

#### GET
##### Summary:

Access task data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The task identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Task](#task) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### PUT
##### Summary:

Update the task.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The task identifier | Yes | string |
| description | body | The task description | No | string |
| status | body | The task status | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Task](#task) |
| 400 |  |  |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /tracks

#### GET
##### Summary:

Access tracks for the connected user.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Track](#track) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### POST
##### Summary:

Create the track for the given data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| projectId | body | The track identifier | Yes | string |
| startTime | body |  | Yes | string |
| endTime | body |  | Yes | string |
| songStartTime | body |  | Yes | string |
| songEndTime | body |  | Yes | string |
| song | body | The song | No | [Song](#song) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Successful operation | [Track](#track) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /tracks/{id}

#### GET
##### Summary:

Access track data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The track identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Track](#track) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /tracks/{id}/workflow

#### GET
##### Summary:

Access workflow for the given track.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The track identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Workflow](#workflow) ] |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /users

#### GET
##### Summary:

Access available users.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [User](#user) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /workflows

#### GET
##### Summary:

Access workflows for the connected user.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [ [Workflow](#workflow) ] |
| 401 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### POST
##### Summary:

Create the workflow for the given track.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| track | body | The track identifier | Yes | string |
| description | body | The worflow description | Yes | string |
| expectedStartDate | body | The worflow expected start date | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Successful operation | [Workflow](#workflow) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

### /workflows/{id}

#### GET
##### Summary:

Access workflow data.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The worflow identifier | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Workflow](#workflow) |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |

#### PUT
##### Summary:

Update the workflow.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | The worflow identifier | Yes | string |
| description | body | The worflow description | No | string |
| expectedStartDate | body | The worflow expected start date | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful operation | [Workflow](#workflow) |
| 400 |  |  |
| 401 |  |  |
| 403 |  |  |
| 500 |  |  |

##### Security

| Security Schema | Scopes |
| --- | --- |
| auth | |
