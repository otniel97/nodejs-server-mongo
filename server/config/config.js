//======================
//Puerto rest server
//======================

process.env.PORT = process.env.PORT | 3000;


//======================
//Conexión mongodb
//======================

/* let urlDB;
urlDB = 'mongodb://172.17.0.2:27017/cafe';
process.env.URLDB = urlDB; */


//================================
//            Entorno
//================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//       Vencimiento del token
//================================
process.env.CADUCIDAD_TOKEN = '48h';


//================================
//     Seed de autenticación
//================================

process.env.SEED = process.env.SEED || 'secret-dev'

//================================
//            Base de datos
//================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://172.17.0.2:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;