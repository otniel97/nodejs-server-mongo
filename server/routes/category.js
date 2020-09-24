// ====================================================
//      Rutas API: Category
// ====================================================

const express = require('express');

const Category = require('../models/category');

const { verifiedToken, verifiedAdminRol } = require('../middlewares/autentication')

const app = express();

//==============================
//Mostrar todas las categorías
//==============================
app.get('/categories', verifiedToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories
            });
        });
});

//==============================
//Mostrar categoría por id
//==============================
app.get('/category/:id', verifiedToken, (req, res) => {
    id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró la categoría'
            });
        }
        res.json({
            ok: true,
            categoryDB
        });
    });
});

//==============================
//Crear nueva categorías
//==============================
app.post('/category', [verifiedToken, verifiedAdminRol], (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoryDB,
            message: 'Categoría registrada'
        });
    });
});

//==============================
//Actualizar categoría
//==============================
app.put('/category/:id', [verifiedToken, verifiedAdminRol], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let categoryUpdate = {
        name: body.name,
        description: body.description
    };

    Category.findByIdAndUpdate(id, categoryUpdate, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        console.log('as');
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: categoryDB
        });
    })
});

//==============================
//Eliminar categoría
//==============================
app.delete('/category/:id', [verifiedToken, verifiedAdminRol], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoryDB,
            result: {
                message: 'Categoría borrada'
            }
        });
    });
});

module.exports = app;