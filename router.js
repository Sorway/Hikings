const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use fs.promises for cleaner async handling
const { getHikings } = require('./public/javascripts/hikings');
const { sendEmail } = require('./public/javascripts/mail');

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg)$/i;

exports.router = (() => {
    const apiRouter = express.Router();

    async function getFilteredFiles(directory, regex) {
        try {
            const files = await fs.readdir(directory);
            return files.filter(file => regex.test(file));
        } catch {
            return [];
        }
    }

    // Route Handlers
    apiRouter.get('/', (req, res) => res.status(200).render('index'));

    apiRouter.get('/about', (req, res) => res.status(200).render('about'));

    apiRouter.get('/contact', (req, res) => res.status(200).render('contact'));

    apiRouter.get('/hikings', (req, res) => {
        const hikingsData = getHikings();
        res.status(200).render('hikings', { hikings: hikingsData });
    });

    //API
    apiRouter.get('/api/v1/hikings', (req, res) => {
        try {
            const hikings = getHikings()
                .filter(hiking => hiking.coordinates)
                .map(hiking => {
                    const [lat, lng] = hiking.coordinates.split(',').map(Number);
                    return {
                        name: hiking.name,
                        coordinates: [lat, lng],
                        city: hiking.city,
                        department: hiking.department,
                        region: hiking.region,
                        folder: hiking.folder,
                        image: hiking.image
                    };
                });
            res.json(hikings);
        } catch (err) {
            console.error('Erreur lors de la récupération des données des randonnées :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    apiRouter.get('/hiking/:name', async (req, res) => {
        const name = req.params.name;
        const hiking = getHikings().find(h => h.folder === name);

        if (!hiking) return res.redirect('/hikings');

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
                videosPath: `/videos/hikings/${name}`,
                map: `/gpx/${name}.gpx`,
            });
        } catch {
            res.redirect('/hikings');
        }
    });

    // Mail sender
    apiRouter.post('/send-email', async (req, res) => {
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

    // Redirections
    apiRouter.get('/github', (req, res) =>
        res.redirect('https://github.com/Sorway/Hikings')
    );

    apiRouter.get('/tiktok', (req, res) =>
        res.redirect('https://www.tiktok.com/@jonathan.gp26')
    );

    return apiRouter;
})();
