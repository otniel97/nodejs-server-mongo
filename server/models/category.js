const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es requerido']
    }
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Category', categorySchema);