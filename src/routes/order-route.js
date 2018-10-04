'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-service');

router.post('/', authService.autorize, controller.post);
router.get('/', authService.autorize, controller.get);

module.exports = router;