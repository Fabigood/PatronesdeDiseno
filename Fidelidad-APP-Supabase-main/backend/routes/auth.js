const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { authController } = require('../core/container');

router.post('/login', asyncHandler(authController.login));

module.exports = router;
