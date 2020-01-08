# graphql_nodejs_mongo
GraphQL Apollo with NodeJS and MongoDB

This is a sample repository with GraphQL Apollo server. It is using MongoDB as a database.

MongoDB is configured as Docker container. There is a docker compose which is in `docker` directory:
```version: '3.1'
services:
  mongo_27018:
    image: mongo
    volumes:
    - ./data:/data/db
    ports:
    - 27018:27017
  ```
  
Please note that the container port is mapped to port 27018 to avoid conflict with default installation, if any.
  
To start the server execute `node server.js`
  
WORK-IN-PROGRESS: Currently some data is residing in static file
  
In order to interact with GraphQL please download the latest version of Postman.  It contains Beta version of the GraphQL POST body.

Import Postman collection provided with the project.

[MongoDB database client Robo 3T](https://www.robomongo.org/)
