const express = require('express');
const morgan = require('morgan');
const moment = require('moment-timezone');
const cors = require('cors');
const dotenv = require('dotenv').config();
const router = require('./router').router;

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors({
    origin: '*',
}));
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