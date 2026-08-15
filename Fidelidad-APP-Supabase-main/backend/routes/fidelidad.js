const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { fidelidadController } = require('../core/container');

router.get('/resumen', asyncHandler(fidelidadController.getResumen));


router.get('/clientes', asyncHandler(fidelidadController.listClientes));
router.post('/clientes', asyncHandler(fidelidadController.createCliente));
router.put('/clientes/:id', asyncHandler(fidelidadController.updateCliente));
router.delete('/clientes/:id', asyncHandler(fidelidadController.deleteCliente));
router.post('/clientes/:id/tarjeta', asyncHandler(fidelidadController.enviarTarjeta));
router.get('/clientes/:id/tarjeta/preview', asyncHandler(fidelidadController.previsualizarTarjetaCliente));
router.get('/tarjetas', asyncHandler(fidelidadController.listTarjetasEnviadas));
router.get('/tarjetas/:id/preview', asyncHandler(fidelidadController.previsualizarTarjetaEnviada));

router.post('/compras', asyncHandler(fidelidadController.registrarCompra));

router.get('/recompensas', asyncHandler(fidelidadController.listRecompensas));
router.post('/recompensas', asyncHandler(fidelidadController.createRecompensa));
router.put('/recompensas/:id', asyncHandler(fidelidadController.updateRecompensa));
router.delete('/recompensas/:id', asyncHandler(fidelidadController.deleteRecompensa));

router.post('/reclamos', asyncHandler(fidelidadController.registrarReclamo));

module.exports = router;
