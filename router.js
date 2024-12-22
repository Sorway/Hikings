const express = require('express');
const path = require('path');
const fs = require('fs');
const { getHikings } = require('./public/javascripts/hikings');
const { sendEmail } = require("./public/javascripts/mail");
const {response} = require("express");

exports.router =  (function () {
    const apiRouter = express.Router();

    apiRouter.get('/', function (req, res) {
        res.status(200).render('index');
    });

    apiRouter.get('/about', function (req, res) {
        res.status(200).render('about');
    });

    apiRouter.get('/contact', function (req, res) {
        res.status(200).render('contact');
    });

    apiRouter.get('/hikings', function (req, res) {
        const hikingsData = getHikings();
        res.status(200).render('hikings', { hikings: hikingsData });
    });

    apiRouter.get('/hiking/:name', function (req, res) {
        const name = req.params.name;
        const hiking = getHikings().find(h => h.folder === name);
        const imagesPath = path.join(__dirname, 'public/images/hikings', name);
        const videosPath = path.join(__dirname, 'public/videos/hikings', name);

        if (!hiking) {
            return res.redirect('/hikings');
        }

        fs.readdir(imagesPath, (err, imageFiles) => {
            if (err) {
                return res.redirect('/hikings');
            }

            const filteredImages = imageFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/.test(file));

            fs.readdir(videosPath, (err, videoFiles) => {
                if (err) {
                    videoFiles = [];
                }

                const filteredVideos = videoFiles.filter(file => /\.(mp4|webm|ogg)$/.test(file));

                res.status(200)
                    .render('hiking', {
                        name: name,
                        hiking: hiking,
                        images: filteredImages,
                        videos: filteredVideos,
                        imagesPath: `/images/hikings/${name}`,
                        videosPath: `/videos/hikings/${name}`,
                        map: `/gpx/${name}.gpx`
                    });
            });
        });
    });

    // Mail sender

    apiRouter.post('/send-email', (req, res) => {
        const { name, subject, email, message } = req.body;
        const sender = `${name} <${email}>`

        sendEmail({ sender, subject, message }).then(result => {
            res.redirect('/contact');
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