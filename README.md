# Node App with Docker and Kubernetes
Simple App Using Docker and Kubernetes. Via the app, children can send virtual letters to Santa Claus.

# Docker Commands

#### To build the docker image for the node app. Whenever you modify something in the code, the image should be rebuilt. Don't forget to navigate to the corresponding folders for each command:
    docker build -t santa-letters-frontend .
    docker build -t santa-letters-backend .
    docker build -t santa-letters-auth .

#### To run the entire app using docker-compose:
    docker-compose up

#### To stop the entire app using docker-compose::
    docker-compose down

# How to run the app
In the test.rest file, you can send HTTP requests to interact with the app.
If run in VSCode, it is useful to have the REST Client extension installed.

Alternatively, you can access the frontend service.

# Application Architecture Info

## Frontend
Frontend is running on http://localhost:13000.
Frontned communicates with the backend and auth interfaces through frontend-network.

## Backend
### server.js
This file contains the business logic.

## Auth
### auth.js
This file makes the authentication and authorization steps using JWT.

Backend and auth communicate through backend-auth-network.

## Postgres
Postgres is used as the db. There are 2 databases (db and db-auth) separated in different networks (backend-network and auth-network):.

Credentials:
- POSTGRES_PASSWORD: password123
- POSTGRES_USER: user123
- POSTGRES_DB: db123

! These should match the credentials defined in the db.js file from the backend folder!

## Adminer
Adminer is the database management tool used to view the 2 databases.
Adminer is running on http://localhost:13000.

Credentials:
- select PostgresMSQL
- POSTGRES_PASSWORD: password123
- POSTGRES_USER: user123
- POSTGRES_DB: db123

## Portainer
Portainer is a container management software used to deploy, troubleshoot, and secure applications.
Portainer is running on http://localhost:9000.

Credentials:
- user: admin
- password: qwerty123!@#

## Kind
Kind is a tool for running local Kubernetes clusters using Docker container "nodes".


# TODO
- Beautify frontend for app
- Figure out what Portainer does
- Integrate with K8S (kind)
- Integrate with Terraform
