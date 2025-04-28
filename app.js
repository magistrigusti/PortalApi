// app.js
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = reqire('fs');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');
// static fail from folder 'upLoads'
app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes')); // добавил / перед api

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Обработка 404 ошибок
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Глобальная обработка всех ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
