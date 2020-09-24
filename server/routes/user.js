// ====================================================
//      Rutas API: User
// ====================================================

const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const { verifiedToken, verifiedAdminRol } = require('../middlewares/autentication')

const app = express();

//obtener usuario por id
app.get('/user/:id', (req, res) => {

    let id = req.params.id;

    User.findById(id, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

//obtener todos los usuarios
app.get('/users', verifiedToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true } /*{google: true }, 'name email' */ ) //dentro de {field: value} filtrar por campos. despues de la coma datos que quiero traer de la BD por cada user
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({ status: true /* google: true */ }, (err, cont) => {
                res.json({
                    ok: true,
                    users,
                    counts: cont
                });
            });
        });
});

//crear usuario
app.post('/user', [verifiedToken, verifiedAdminRol], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: user
        });
    });

});

//editar usuario
app.put('/user/:id', [verifiedToken, verifiedAdminRol], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

});

//eliminación física usuario 
app.delete('/user/:id', [verifiedToken, verifiedAdminRol], (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB,
            result: {
                message: 'Usuario borrado'
            }
        });
    });
});

//eliminación lógica de usuario
app.put('/user/delete/:id', [verifiedToken, verifiedAdminRol], (req, res) => {

    let id = req.params.id;

    User.findById(id, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let changeState = {
            status: true
        }

        if (userDB.status === true) {
            changeState.status = false
        }

        User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userDB
            });
        });


    });
});

module.exports = app;