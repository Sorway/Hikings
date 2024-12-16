const mysql = require("mysql");
const dotenv = require('dotenv').config();

const database = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

database.connect(error => {
    if (error) {
        console.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
    console.log('Connecté à la base de données.');
});

module.exports = {
    connection: database
};