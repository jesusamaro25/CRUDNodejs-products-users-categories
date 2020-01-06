//Puerto:
process.env.PORT = process.env.PORT || 3000;

//Entorno:
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' //estoy en produccion o desarrollo 

//Vencimiento del token (60s * 60min * 24h * 30d)

process.env.CADUCIDAD_TOKEN = '48h';

//Seed de autenticacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//BD:
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://jesusamaro:password@cafe-4wsrw.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB

// Google client ID
process.env.CLIENTID = process.env.CLIENTID || '1023745995022-49puub02b09uigj2il4i91nsipfocrtm.apps.googleusercontent.com'