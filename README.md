# Node App with Docker and Kubernetes
Simple App Using Docker and Kubernetes. Via the app, children can send virtual letters to Santa Claus.

# Commands

#### To build the docker image for the node app:
    docker build -t santa-letters-app .

#### To run the entire app using docker-compose:
    docker-compose up

#### To stop the entire app using docker-compose::
    docker-compose down

# Useful info

Postgres is used for db.
Credentials:
- POSTGRES_PASSWORD: password123
- POSTGRES_USER: user123
- POSTGRES_DB: db123
! These should match the credentials defined in the db.js file
