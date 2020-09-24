require('./config/config.js')

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

//parse applicaytion/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, resp) => {
    if (err) throw Error;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto:', 3000);
})