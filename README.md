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

`node_modules` are not checked in.  Please run `npm install`
  
To start the server execute `node server.js`
  
In order to interact with GraphQL please download the latest version of Postman.  It contains Beta version of the GraphQL POST body.

### running postman collection from command line using newman
1. Install newman -> npm install newman
2. Make sure the server is running -> `node server.js`
3. Change directory into `postman` where `postman.collection` is stored.
4. run command line `newman run postman_collection.json`

You should see the response from Newman.  If there are tests defined in Postman collection on each request, `newman` will run them as well.

### testing with Postman

Import Postman collection provided with the project.

### MongoDB Database Client

[MongoDB database client Robo 3T](https://www.robomongo.org/)

### All users are fetched out of MongoDB

#### Sequence to get user
1. Create User in Database
2. Login as User
3. Get JWT token which response from Login and put it in `Authorization` header for Get User. 
    Make sure the first word in `Authorization` header is `Bearer <JWT token>`
4. Run Get User
