const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(express.json());

logger.info('Connecting to MongoDB:', config.MONGODB_URI, '\n');

// Connect to MongoDB database
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB\n');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  })

// Use cors package to prevent cors-problems
app.use(cors());
app.use(express.static('build'));

// Log requests to the api
app.use(middleware.requestLogger);

// Endpoints and their respective routers
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
