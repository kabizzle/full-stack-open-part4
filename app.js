const config = require('./utils/config');
const express = require('express');

const app = express();
const cors = require('cors');

app.use(express.json());

require('express-async-errors');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware')

const mongoose = require('mongoose');

logger.info('Connecting to MongoDB:', config.MONGODB_URI, '\n');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB\n');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  })

app.use(cors());
app.use(express.static('build'));

app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
