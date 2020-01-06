const express = require('express');
const { verificaTokenImg } = require('../middlewares/auth');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {

        let noImagePath = path.resolve(__dirname, '../assets/noimage.jpg');
        res.sendFile(noImagePath);
    }



})

module.exports = app;