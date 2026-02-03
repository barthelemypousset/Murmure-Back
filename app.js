// app.js is responsible for defining the routes, middleware, and other application-level functionality

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/usersRoute');
var chaptersRouter = require('./src/routes/chaptersRoute');
var meditationRouter = require('./src/routes/meditationsRoute');

var app = express();

// Whitelist of allowed frontend domains
const allowedOrigins = [
  'https://murmure.expo.app', // <--- !!! REPLACE with your Vercel/Render frontend URL
  'http://localhost:8081', // Allows local development with `npx expo start --web`
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    // If the origin is in our whitelist, allow it
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      // Otherwise, block it
      const msg = 'The CORS policy for this site does not allow access from your origin.';
      return callback(new Error(msg), false);
    }
  },
};

// Use the cors middleware with our specific options
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chapters', chaptersRouter);
app.use('/meditations', meditationRouter);

module.exports = app;
