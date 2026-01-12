# Murmure Back

## Description

> Murmure is an adventure into your mind, into your body, into the understanding of your emotions ! <3

This repository contains the backend code of the project

## Setup of the project

### Start this project

Create your own .env file (based of .env.example) at the root of the project to be able to save your personnal API keys
* Create a mongo database (on mongoAtlas for example) and get the connection string to your instance
* Create an account and generate a token on HugginFaces
* Create a unique JWT secret (A strong String made of >32 alphanumeric characters)

> ! 👻 NEVER COMMIT PERSONNAL PASSWORD OR API KEY 💀 !

Then run
```
yarn install
yarn start
```

#### Why thoses dependencies ?
* mongoose → use to communicate with MongoDB Database
* cors → allow request from different domains (use of external api for exemple)
* dotenv → used for local or production environment variable
* bcrypt → Hash password before sending in DB
* openai → Use for LLM on hugging-faces
* socket.io → WebSockets (used for chat communication)
* jsonwebtoken → Used for JWT authentication

*unused deps (might be handy for meditations upload later)*
* express-fileupload → Allow to upload files using POST request 
* uniqid → unique IDs to use for file (usefull for file upload)
* cloudinary → Cloud service tooling


#### Import data to DB for tests:
Make sure that your connection string exist in your .env file and run:
```
node ./scripts/seed.js
```

#### Test Backend
To test the backend you can run the following curls:
```
// Create new user (will return user info, Token JWT)
curl -X POST -d '{"email":"a", "username":"a", "password":"a"}' -H "Content-Type: application/json" http://localhost:3000/users/signup

// Login as user (will return user info, Token JWT)
curl -X POST -d '{"email":"a", "password":"a"}' -H "Content-Type: application/json" http://localhost:3000/users/signin

// Change username (using JWT token received in signIn/Up curl request)
curl -X PUT http://localhost:3000/users/updateUsername \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer *TOKEN-JWT*" \
  -d '{ "newUsername":"Pouet" }'

// Delete user (using JWT token received in signIn/Up curl request)
curl -X DELETE http://localhost:3000/users/deleteUser \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer *TOKEN-JWT*" \
```
