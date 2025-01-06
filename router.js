const routes = require('express').Router();
const path = require('path');
const fs = require('fs').promises;
const { getShowcases, getHikings, getSpots } = require('./controllers/hikings-controller');
const { sendEmail } = require('./public/javascript/mail');

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg)$/i;

async function getFilteredFiles(directory, regex) {
    try {
        const files = await fs.readdir(directory);
        return files.filter(file => regex.test(file));
    } catch {
        return [];
    }
}

routes.get('/' , async (req, res) => {
    try {
        const showcases = await getShowcases();
        res.render('index', { showcases });
    } catch (err) {
        console.log('Erreur lors du chargement des données: ', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

routes.get('/about', async (req, res) => res.render('about'));

routes.get('/map', async (req, res) => res.render('map'));

routes.get('/contact', async (req, res) => res.render('contact'));

routes.get('/hikings/:name', async (req, res) => {
    const name = req.params.name;
    const hikings = await getHikings();
    const hiking = hikings.find(h => h.folder === name);

    if (!hiking) return res.redirect('/map');

    const imagesPath = path.join(__dirname, 'public/images/hikings', name);
    const videosPath = path.join(__dirname, 'public/videos/hikings', name);

    try {
        const [filteredImages, filteredVideos] = await Promise.all([
            getFilteredFiles(imagesPath, IMAGE_EXTENSIONS),
            getFilteredFiles(videosPath, VIDEO_EXTENSIONS),
        ]);

        res.status(200).render('hiking', {
            name,
            hiking,
            images: filteredImages,
            videos: filteredVideos,
            imagesPath: `/images/hikings/${name}`,
            videosPath: `/videos/${name}`,
            map: `/gpx/${name}.gpx`,
        });
    } catch {
        res.redirect('/map');
    }
});

routes.get('/spots/:name', async (req, res) => {
    const name = req.params.name;
    const spots = await getSpots();
    const spot = spots.find(s => s.folder === name);

    if (!spot) return res.redirect('/map');

    const imagesPath = path.join(__dirname, 'public/images/spots', name);
    const videosPath = path.join(__dirname, 'public/videos/spots', name);

    try {
        const [filteredImages, filteredVideos] = await Promise.all([
            getFilteredFiles(imagesPath, IMAGE_EXTENSIONS),
            getFilteredFiles(videosPath, VIDEO_EXTENSIONS),
        ]);

        res.status(200).render('spot', {
            name,
            spot,
            images: filteredImages,
            videos: filteredVideos,
            imagesPath: `/images/spots/${name}`,
            videosPath: `/videos/spots/${name}`
        });
    } catch {
        res.redirect('/map');
    }
});

// Mail sender
routes.post('/send-email', async (req, res) => {
    const { name, subject, email, message } = req.body;
    const sender = `${name} <${email}>`;

    try {
        await sendEmail({ sender, subject, message });
        res.redirect('/contact');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

// API
// Utilitaire pour récupérer et formater les données
const fetchAndFormatData = async (getDataFn, res, dataType) => {
    try {
        const data = await getDataFn();
        if (!Array.isArray(data)) {
            throw new Error(`${dataType} n'est pas un tableau.`);
        }

        const formattedData = data
            .filter(item => item.coordinates)
            .map(item => {
                const [lat, lng] = item.coordinates.split(',').map(Number);
                return {
                    name: item.name,
                    coordinates: [lat, lng],
                    city: item.city,
                    department: item.department,
                    region: item.region,
                    folder: item.folder,
                    image: item.image
                };
            });

        res.json(formattedData);
    } catch (err) {
        console.error(`Erreur lors de la récupération des données (${dataType}) :`, err);
        res.status(500).json({ error: `Erreur serveur lors de la récupération des ${dataType}` });
    }
};

// Route pour les randonnées
routes.get('/api/hikings', (req, res) => {
    fetchAndFormatData(getHikings, res, 'randonnées');
});

// Route pour les spots
routes.get('/api/spots', (req, res) => {
    fetchAndFormatData(getSpots, res, 'spots');
});

// Redirections
routes.get('/github', (req, res) =>
    res.redirect('https://github.com/Sorway/Hikings')
);

routes.get('/tiktok', (req, res) =>
    res.redirect('https://www.tiktok.com/@jonathan.gp26')
);

module.exports = routes;