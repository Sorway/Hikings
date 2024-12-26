const database = require('../../database/database').connection;
const cron = require('node-cron');

let hikingsData = []

function loadHikings() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT h.*,
                   IFNULL(CONCAT(t.name, ':', t.color), NULL) AS difficulty,
                   d.duration,
                   d.distance,
                   d.elevation_gain,
                   d.negative_gradient,
                   d.high_point,
                   d.low_point,
                   desctable.description,
                   CASE
                       WHEN COUNT(t2.name) > 0 THEN GROUP_CONCAT(DISTINCT CONCAT(t2.name, ':', t2.color) SEPARATOR ', ')
                       ELSE NULL
                       END AS tags
            FROM Hikings h
                     LEFT JOIN
                 \`Hikings-Data\` d ON h.id = d.id
                     INNER JOIN
                 \`Hikings-Description\` desctable ON h.id = desctable.id
                     LEFT JOIN
                 Tags t ON d.difficulty = t.id
                     LEFT JOIN
                 \`Hikings-Tags\` ht ON h.id = ht.hiking_id
                     LEFT JOIN
                 Tags t2 ON ht.tag_id = t2.id
            GROUP BY h.id, difficulty, d.duration, d.distance, d.elevation_gain, d.negative_gradient, d.high_point,
                     d.low_point, desctable.description
            ORDER BY h.\`order\` ASC
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