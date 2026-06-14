# Census API

A REST API built with Express.js and MySQL (Sequelize) that lets an admin user manage participant census data. Secured with Basic Auth, using an Aiven-managed MySQL database.

## Tech Stack

Node.js - Express - MySQL - Sequelize - Basic Auth - Aiven

## API Endpoints

All endpoints require Basic Auth (demo login: admin, password: P4ssword).

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| POST   | /participants/add            | Add a new participant                  |
| GET    | /participants                | Get all participants                   |
| GET    | /participants/details        | Get all participants' personal details |
| GET    | /participants/details/:email | Get one participant's personal details |
| GET    | /participants/work/:email    | Get one participant's work details     |
| PUT    | /participants/:email         | Update a participant                   |
| DELETE | /participants/:email         | Delete a participant                   |

## Run Locally

1. Clone the repo and install dependencies:

   git clone https://github.com/alp-isik/census-api.git
   cd census-api
   npm install

2. Create a .env file in the project root:

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your-local-mysql-password
   DB_NAME=census_db
   PORT=3000

3. Start the server:

   npm start

## Notes

You will need a MySQL database to run this project. You can use a local MySQL instance or a cloud-hosted one like Aiven. Update the .env file with your database credentials before starting.

The included Postman collection (census-api.postman_localhost.json) covers all endpoints for local testing.
