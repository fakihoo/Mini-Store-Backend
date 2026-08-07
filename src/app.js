const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true
}));

app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;