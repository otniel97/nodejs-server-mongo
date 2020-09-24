// ====================================================
//      Controllers product
// ====================================================

const Product = require('../models/product');

const _ = require('underscore');

//==============================
//Mostrar todos los productos
//==============================
let getProducts = (req, res) => {
    Product.find({ enabled: true })
        .limit(3)
        .populate('user', 'name email')
        .populate('category', 'name description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (products.length === 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'No hay productos registrados'
                });
            }
            res.json({
                ok: true,
                products
            });
        });
}

//==============================
//Mostrar producto por id
//==============================
let getProductById = (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDB) {
                res.status(400).json({
                    ok: false,
                    message: 'No se encontró el producto'
                });
            }
            res.json({
                ok: true,
                productDB
            });
        });
}

//==============================
//Crear producto
//==============================
let saveProduct = (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        enabled: body.enabled,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productDB,
            message: 'Producto registrado'
        });
    });
}

//==============================
//Actualizar producto
//==============================
let updateProduct = (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'priceUni', 'description', 'enabled', 'category', 'user']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'producto no encontrado'
            });
        }
        res.json({
            ok: true,
            productDB,
            message: 'Producto actualizado'
        });
    });
}

//==============================
//Eliminar producto por id
//==============================
let deleteProduct = (req, res) => {
    let id = req.params.id;

    Product.findByIdAndRemove(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'producto no encontrado'
            });
        }
        res.json({
            ok: true,
            productDB,
            message: 'Producto eliminado'
        });
    });
}

//==============================
//Activar desactivar producto
//==============================
let statusProduct = (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'producto no encontrado'
            });
        }

        if (productDB.enabled === true) {
            productDB.enabled = false
        } else
            productDB.enabled = true

        productDB.save((err, productDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productDB,
                message: 'Producto eliminado'
            });
        });

        /* let changeEnabled = {
            enabled: true
        }
        if (productDB.enabled === true) {
            changeEnabled.enabled = false
        }
        Product.findByIdAndUpdate(id, changeEnabled, { new: true }, (err, productDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productDB
            });
        }); */

    });
}

module.exports = {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    statusProduct
}