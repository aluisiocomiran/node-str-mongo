'use strict';

/* jshint ignore:start */

const mongoose = require('../models/customer');
const Customer = mongoose.model('Customer');

exports.get = async() => {
    const res = await Customer
        .find({
            active: true
        },'name email');
    return res;
};

exports.authenticate = async(data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    })
    return res;
}

exports.getById = async(id) => {
    const res = await Customer
        .findById(id);
    return res;
};

exports.post = async(data) => {
    var customer = new Customer(data);
    await customer.save();
};

exports.put = async(id, data) => {
    await Customer
        .findByIdAndUpdate(id, {
            $set: {
                name: data.name,
                password: data.password,
                email: data.email
            }
        });
};

exports.delete = async(id) => {
    await Customer.findByIdAndRemove(id);
};
/* jshint ignore:end */