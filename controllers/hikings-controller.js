const database = require("../database/database").connection;

// Cache local pour éviter de charger plusieurs fois les mêmes données
let showcases = []
let hikings = []
let spots = []

/**
 * Fonction générique pour charger des données depuis la base de données
 * @param {string} query - La requête SQL à exécuter
 * @param {string} label - Label utilisé pour les logs
 * @returns {Promise<Array>} - Résultats de la requête
 */
async function loadData(query, label) {
    return new Promise((resolve, reject) => {
        database.query(query, (err, results) => {
            if (err) {
                console.error(`[${label}] Erreur lors de la récupération des données depuis la base de données :`, err);
                reject(err);
            } else {
                console.log(`[${label}] Chargement des données depuis la base de données terminé.`);
                resolve(results);
            }
        });
    });
}

// Chargement des données avec cache
async function getShowcases() {
    if (showcases.length === 0) {
        showcases = await loadData(`SELECT * FROM Showcases;`, 'Showcases');
    }
    return showcases;
}

async function getHikings() {
    if (hikings.length === 0) {
        hikings = await loadData(`SELECT * FROM Hikings H LEFT JOIN \`Hikings-Data\` HD ON H.id = HD.id INNER JOIN \`Hikings-Description\` D ON H.id = D.id WHERE only_photo = 0;`, 'Hikings');
    }
    return hikings;
}

async function getSpots() {
    if (spots.length === 0) {
        spots = await loadData(`SELECT * FROM Hikings H INNER JOIN \`Hikings-Description\` D ON H.id = D.id WHERE only_photo = 1;`, 'Spots');
    }
    return spots;
}

module.exports = { getShowcases, getHikings, getSpots };