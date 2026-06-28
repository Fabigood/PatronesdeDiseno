const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { fidelidadController } = require('../core/container');

router.get('/clientes', asyncHandler(fidelidadController.listClientes));
router.post('/clientes', asyncHandler(fidelidadController.createCliente));
router.put('/clientes/:id', asyncHandler(fidelidadController.updateCliente));
router.delete('/clientes/:id', asyncHandler(fidelidadController.deleteCliente));

router.post('/compras', asyncHandler(fidelidadController.registrarCompra));

router.get('/recompensas', asyncHandler(fidelidadController.listRecompensas));
router.post('/recompensas', asyncHandler(fidelidadController.createRecompensa));
router.put('/recompensas/:id', asyncHandler(fidelidadController.updateRecompensa));
router.delete('/recompensas/:id', asyncHandler(fidelidadController.deleteRecompensa));

router.post('/reclamos', asyncHandler(fidelidadController.registrarReclamo));

module.exports = router;
