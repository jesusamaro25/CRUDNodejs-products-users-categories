const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; //verificar si hay limite inferior y si no que empiece desde el 1 registro
    desde = Number(desde);

    let limite = req.query.limite || 5 //verificar si hay limite de busqueda y si no que busque 5 registros
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //especificamos los datos que quiero en la respuesta
        .skip(desde) //esto es para que se salte los primeros 5 registros
        .limit(limite) //mostrar los primeros 2
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({ //bad request
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })



        }); //ejecuto

})

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body
        //instancia del usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    //Guardar en la BD
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id; //ese id del final debe ser igual a :id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //senalar que atributos pueden ser cambiados

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //body es lo que se trabaja y new es para que la respuesta sea el usuario con los nuevos datos y el validators es para que respete las validaciones definidad en el schema

        if (err) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })



})

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {


    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        };

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }

            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

});


module.exports = app;