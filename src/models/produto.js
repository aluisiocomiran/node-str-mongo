'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // _id <- cria automaticamnete
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: { // Exemplo: Cadeira Gamer --> cadeira-gamer
        type: String,
        required: true,//[true,'O slug é obrigatório'],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,        
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    tags: [{
        type: String,
        required: true
    }], // é um array
    image: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('Produto', schema);