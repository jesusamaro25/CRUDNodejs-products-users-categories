const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');
const app = express();
const Categoria = require('../models/categoria');


//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') //especifico que atributos del usuario quiero mostrar, el id se pasa por defecto
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({ //bad request
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(500).json({ //bad request
                    ok: false,
                    err,
                    message: 'No se ha encontrado alguna categoria'
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});
//Mostrar categoria por ID

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ //bad request
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({ //bad request
                ok: false,
                err,
                message: 'No se ha encontrado alguna categoria'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Crear nueva categoria

app.post('/categoria', [verificaToken], (req, res) => {


    let body = req.body
        //instancia del usuario
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //Guardar en la BD
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({ //bad request
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'categoria creada'
        });
    });

});


//Actualizar categoria
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => { //body es lo que se trabaja y new es para que la respuesta sea el usuario con los nuevos datos y el validators es para que respete las validaciones definidad en el schema

        if (err) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({ //bad request
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'categoria actualizada'
        });

    });

});



//Delete categoria

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {


    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({ //bad request
                ok: false,
                err
            });
        };

        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }

            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'categoria borrada'
        })


    })

});


//solo la borre el admin y pide token 


module.exports = app;