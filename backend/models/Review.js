const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, ' por favor agregue el titulo de la revision'],
        maxlength: [100, 'La longitud maxima es de 100 caracteres']
    },
    comment: {
        type: String,
        required: [true, ' por favor agregue el comentario de la revision']
    },
    rating: {
        type: Number,
        min : [1, 'El rating minimo es 1'],
        max: [10, 'El rating maximo es 10'],
        required: [true, ' por favor agregue una calificacion entre 0 y 10'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Ingrese el Usuario que hizo la revisiocn ']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Ingrese el Producto al que se le esta haciendo la revisiocn ']
    },
})

module.exports = mongoose.model('Review', ReviewSchema)