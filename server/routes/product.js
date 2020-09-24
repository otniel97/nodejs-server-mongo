// ====================================================
//      Rutas API: Product
// ====================================================

const express = require('express');

const { verifiedToken, verifiedAdminRol } = require('../middlewares/autentication')

const productController = require('../controllers/product');

const api = express.Router();

//==============================
//Mostrar todos los productos
//==============================
api.get('/products', verifiedToken, productController.getProducts);

//==============================
//Mostrar producto por id
//==============================
api.get('/product/:id', verifiedToken, productController.getProductById);

//==============================
//Crear producto
//==============================
api.post('/product', verifiedToken, productController.saveProduct);

//==============================
//Actualizar producto por id
//==============================
api.put('/product/:id', [verifiedToken, verifiedAdminRol], productController.updateProduct);

//==============================
//Borrar producto por id
//==============================
api.delete('/product/:id', [verifiedToken, verifiedAdminRol], productController.deleteProduct);

//==============================
//Actualizar disponiblidad producto por id
//==============================
api.put('/product/delete/:id', [verifiedToken, verifiedAdminRol], productController.statusProduct);

module.exports = api;