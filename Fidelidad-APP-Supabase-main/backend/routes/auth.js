const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const loginRateLimiter = require('../middleware/loginRateLimiter');
const { authController } = require('../core/container');

router.post('/login', loginRateLimiter, asyncHandler(authController.login));

module.exports = router;
