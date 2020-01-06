const express = require('express');
const { verificaToken } = require('../middlewares/auth');
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');

//Mostrar todos los productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                });

            });
        });

});

//Mostrar producto por ID

app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//Buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //flexibilizar la busqueda
    //SI NO QUIERO FLEXIBILIZAR BORRO EL REGEX Y LLAMO AL TERMINO EN EL FIND
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        })

})



//Crear nuevo producto
app.post('/producto', verificaToken, (req, res) => {


    let body = req.body
        //instancia del producto
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    //Guardar en la BD
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({ //bad request
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }
        console.log('el req es', req);
        res.status(201).json({
            ok: true,
            producto: productoDB,
            message: 'producto creado'
        });
    });

});


//Actualizar producto
app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'categoria', 'disponible', 'descripcion']); //senalar que atributos pueden ser cambiados
    //el new es para que la respuesta tenga los datos actualizados
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => { //body es lo que se trabaja y new es para que la respuesta sea el usuario con los nuevos datos y el validators es para que respete las validaciones definidad en el schema

        if (err) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({ //bad request
                ok: false,
                err: {
                    message: 'el ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'producto actualizado'
        });

    });

});



//Delete categoria
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    })


});


module.exports = app;