# Murmure Back

## Description

> Murmure is an adventure into your mind, into your body, into the understanding of your emotions ! <3

This repository contains the backend code of the project

## Setup of the project

### install from scratch
```
mkdir murmure; cd murmure
npx express-generator --no-view --git backend; cd backend
yarn add mongoose cors dotenv uid2 bcrypt express-fileupload uniqid cloudinary socket.io
yarn install
yarn start
```

#### Why thoses dependencies ?
* mongoose → use to communicate with MongoDB Database
* cors → allow request from different domains (use of external api for exemple)
* dotenv → used for local or production environment variable
* uid2 → Unique token generation 
* bcrypt → Hash password before sending in DB
* express-fileupload → Allow to upload files using POST request 
* uniqid → unique IDs to use for file (usefull for file upload)
* cloudinary → Cloud service tooling
* socket.io → WebSockets (used for chat communication, cf. exo week8/socketIO)

#### Other actions needed
Create your own .env file at the root of the project to be able to save your api key ad password localy
> ! 👻 NEVER COMMIT YOUR PASSWORD OR API KEY 💀 !

content of your .env file:
```
CLOUDINARY_URL=*MyCloudinaryPersonalURL*
CONNECTION_STRING_MONGODB=*MyMongoDBPersonalConnectionString*
OPENAI_API_KEY=*MyPersonalChatGptKey*
```
