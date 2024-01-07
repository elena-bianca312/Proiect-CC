# Node App with Docker and Kubernetes
Simple App Using Docker and Kubernetes. Via the app, children can send virtual letters to Santa Claus.

# Docker Commands

#### To build the docker image for the node app. Whenever you modify something in the code, the image should be rebuilt:
    docker build -t santa-letters-backend .

#### To run the entire app using docker-compose:
    docker-compose up

#### To stop the entire app using docker-compose::
    docker-compose down

# How to run the app
In the test.rest file, you can send HTTP requests to interact with the app.
If run in VSCode, it is useful to have the REST Client extension installed.

# Useful info

## Postgres

Postgres is used as the db.
Credentials (AFTER logging into PGAdmin, use these credentials to access the postgres db):
- POSTGRES_PASSWORD: password123
- POSTGRES_USER: user123
- POSTGRES_DB: db123

! These should match the credentials defined in the db.js file from the backend folder!

## PGAdmin

PGAdmin provides a graphical interface for PostgreSQL, it is also an administration and development platform.

PGAdmin is running on http://localhost:5050/.

Credentials for logging into PGAdmin:
- PGADMIN_DEFAULT_EMAIL=santa@yahoo.com
- PGADMIN_DEFAULT_PASSWORD=pass123

PGAdmin Navigation: Servers -> Santa Letters (<your-db-name-when-connecting>) -> db123 -> Schemas -> public -> Tables -> letters (Right-click: view or edit data or smth).

Here you can view the data from the db and make changes to it.

## Frontend
Frontend is running on http://localhost:3001, it is a client accessing the backend service.

Backend is running on http://localhost:3000.

Frontend does not work momentarily.

#### To run the app, run the docker app in one terminal for backend + db (from project root):
    docker build -t santa-letters-backend .
    docker-compose up
#### After doing that, run the frontend in another terminal (from frontend folder):
    npm start

# TODO

- Build frontend for app
- Integrate with K8S and Terraform
- Integrate a container management tool like Portainer/Rancher/Yacht for container management
