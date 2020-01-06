const express = require('express');
const app = express();



app.use(require('./usuario')); //para que todas las rutas declaradas tengan efecto
app.use(require('./login')); //para que todas las rutas declaradas tengan efecto
app.use(require('./categoria')); //para que todas las rutas declaradas tengan efecto
app.use(require('./producto')); //para que todas las rutas declaradas tengan efecto
app.use(require('./upload')); //para que todas las rutas declaradas tengan efecto
app.use(require('./imagenes')); //para que todas las rutas declaradas tengan efecto


module.exports = app;