const express = require('express');
const morgan = require('morgan');
const moment = require('moment-timezone');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const router = require('./router').router;

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

morgan.token('paris-hour', () => {
    return moment().tz('Europe/Paris').format('HH:mm');
});

server.use(morgan('[:paris-hour] :method :url :status :response-time ms'));

server.use('/', router);
server.use(express.static(__dirname + '/public'));

server.use(function (req, res, next) {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log(`Server listing on port ${PORT}.`);
});