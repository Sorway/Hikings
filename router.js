const express = require('express');
const path = require('path');
const fs = require('fs');
const { getHikings } = require('./scripts/hikings');

exports.router =  (function () {
    const apiRouter = express.Router();

    apiRouter.get('/', function (req, res) {
        res.status(200).render('index');
    });

    apiRouter.get('/about', function (req, res) {
        res.status(200).render('about');
    });

    apiRouter.get('/hikings', function (req, res) {
        const hikingsData = getHikings();
        res.status(200).render('hikings', { hikings: hikingsData });
    });

    apiRouter.get('/hiking/:name', function (req, res) {
        const name = req.params.name;
        const hiking = getHikings().find(h => h.folder === name);
        const imagesPath = path.join(__dirname, 'public/images/hikings', name);

        if (!hiking) {
            return res.redirect('/hikings');
        }

        fs.readdir(imagesPath, (err, files) => {
            if (err) {
                return res.redirect('/hikings');
            }

            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/.test(file));

            res.status(200)
                .render('hiking', {
                    name: name,
                    hiking: hiking,
                    images: imageFiles,
                    imagesPath: `/images/hikings/${name}`,
                    map: `/gpx/${name}.gpx`
                });
        });
    });

    // Redirections

    apiRouter.get('/github', function (req, res) {
        res.redirect('https://github.com/Sorway/Hikings');
    });

    apiRouter.get('/tiktok', function (req, res) {
        res.redirect('https://www.tiktok.com/@jonathan.gp26');
    });

    return apiRouter;
})();