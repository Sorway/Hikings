const database = require('../database/database').connection;
const cron = require('node-cron');

let hikingsData = []

function loadHikings() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                h.*,
                d.difficulty,
                d.duration,
                d.distance,
                d.elevation_gain,
                d.negative_gradient,
                d.high_point,
                d.low_point,
                desctable.description
            FROM
                Hikings h
            LEFT JOIN
                \`Hikings-Data\` d ON h.id = d.id
            INNER JOIN
                \`Hikings-Description\` desctable ON h.id = desctable.id
            ORDER BY
                h.\`order\` ASC
        `;

        database.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                hikingsData = results;
                console.log('Randonnées mises à jour depuis la BDD avec détails');
                resolve(hikingsData);
            }
        });
    });
}

function getHikings() {
    return hikingsData;
}

cron.schedule('0 * * * *', () => {
    loadHikings().catch(err => console.error('Erreur lors de la mise à jour des randonnées :', err));
});

loadHikings().catch(err => console.error('Erreur lors du chargement initial des randonnées :', err));

module.exports = { getHikings };