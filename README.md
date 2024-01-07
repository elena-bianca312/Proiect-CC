# Node App with Docker and Kubernetes
Simple App Using Docker and Kubernetes. Via the app, children can send virtual letters to Santa Claus.

# Docker Commands

#### To build the docker image for the node app. Whenever you modify something in the code, the image should be rebuilt:
    docker build -t santa-letters-app .

#### To run the entire app using docker-compose:
    docker-compose up

#### To stop the entire app using docker-compose::
    docker-compose down

# How to run the app
In the test.rest file, you can send HTTP requests to interact with the app.
If run in VSCode, it is useful to have the REST Client extension installed.

# Useful info

Postgres is used for db.
Credentials:
- POSTGRES_PASSWORD: password123
- POSTGRES_USER: user123
- POSTGRES_DB: db123

! These should match the credentials defined in the db.js file !

# TODO

- Build frontend for app
- Integrate with K8S and Terraform
