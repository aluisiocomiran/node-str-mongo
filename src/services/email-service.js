'use strict';

/* jshint ignore:start */

var config = require('../config');
var sendGrid = require('sendgrid')(config.sendGridKey);

exports.send = async (to, subject, body) => {
    sendGrid.send({
        to: to,
        from: 'aluisiocomiran@gmail.com',
        subject: subject,
        html: body
    })
}

/* jshint ignore:end */