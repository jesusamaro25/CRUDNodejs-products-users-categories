require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path') //para que la carpeta public sea visible
const port = process.env.PORT;
const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//para que todas las rutas declaradas tengan efecto
app.use(require('./routes/index')); //para que todas las rutas declaradas tengan efecto







mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {

    if (err) throw err;
    console.log('base de datos ONLINE');

});

app.listen(port, () => console.log(`Escuchando el puerto ${port}!`))