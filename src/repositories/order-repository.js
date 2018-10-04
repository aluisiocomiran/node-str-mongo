'use strict';

/* jshint ignore:start */

const mongoose = require('../models/order');
const Order = mongoose.model('Order');

exports.get = async() => {
    var res = await Order.find({},'number status createDate customer itens')
        .populate('customer', 'name')
        .populate('itens.product', 'title price');
    return res;
};

exports.getById = async(id) => {
    var res = await Order
        .findById(id);
    return res;
};

exports.post = async(data) => {
    var order = new Order(data);
    await order.save();
};

exports.put = async(id, data) => {
    await Order
        .findByIdAndUpdate(id, {
            $set: {
                number: date.number,
                status: date.status,
                customer: date.customer,
                itens:data.itens
            }
        });
};

exports.delete = async(id) => {
    await Order.findByIdAndRemove(id);
};

/* jshint ignore:end */