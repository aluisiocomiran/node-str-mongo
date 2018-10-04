'use strict';

/* jshint ignore:start */

const mongoose = require('../models/produto');
const Produto = mongoose.model('Produto');

exports.get = async() => {
    const res = await Produto
        .find({
            active: true
        },'title price slug');
    return res;
};

exports.getById = async(id) => {
    const res = await Produto
        .findById(id);
    return res;
};

exports.getByTag = async(tag) => {
    const res = await Produto
        .find({
            tags: tag,
            active: true
        },'title description price slug tags');
    return res;
};

exports.getBySlug = async(slug) => {
    const res = await Produto
        .findOne({ // find tras um array, findOne somente um resultado
            slug: slug,
            active: true
        },'title description price slug tags');
    return res;
};

exports.post = async(data) => {
    var produto = new Produto(data);
    await produto.save();
};

exports.put = async(id, data) => {
    await Produto
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price
            }
        });
};

exports.delete = async(id) => {
    await Produto.findByIdAndRemove(id);
};
/* jshint ignore:end */