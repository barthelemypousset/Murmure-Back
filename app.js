// app.js is responsible for defining the routes, middleware, and other application-level functionality

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./src/routes/index');
var usersRouter = require("./src/routes/usersRoute");
var chaptersRouter = require("./src/routes/chaptersRoute");
var meditationRouter = require('./src/routes/meditationsRoute');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/users", usersRouter);
app.use("/chapters", chaptersRouter);
app.use('/meditations', meditationRouter);


module.exports = app;
