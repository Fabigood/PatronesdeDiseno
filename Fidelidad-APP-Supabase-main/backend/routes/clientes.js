const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { clienteController } = require('../core/container');

router.get('/', asyncHandler(clienteController.list));
router.post('/', asyncHandler(clienteController.create));
router.put('/:id', asyncHandler(clienteController.update));
router.delete('/:id', asyncHandler(clienteController.delete));

module.exports = router;
