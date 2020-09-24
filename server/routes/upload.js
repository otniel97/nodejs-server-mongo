const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

const User = require('../models/user');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let typesValidate = ['products', 'users'];
    if (typesValidate.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tyoeValidate.join(','),
                type: typesValidate
            }
        });
    }

    let file = req.files.file;
    let fileName = file.name.split('.');
    let extension = fileName[fileName.length - 1];

    let extensionValidate = ['jpg', 'png', 'gif', 'jpeg']

    if (extensionValidate.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son ' + extensionValidate.join(','),
                ext: extension
            }
        });
    }

    fileName = `${id}-${new Date().getMilliseconds}.${extension}`

    file.mv(`uploads/${type}/${file.name}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'archivo subida correctamente'
        });
    });
});

module.exports = app;