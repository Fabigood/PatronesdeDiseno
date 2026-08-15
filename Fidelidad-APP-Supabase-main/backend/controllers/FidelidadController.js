class FidelidadController {
  constructor({ clienteService, fidelidadService, tarjetaFidelidadService }) {
    this.clienteService = clienteService;
    this.fidelidadService = fidelidadService;
    this.tarjetaFidelidadService = tarjetaFidelidadService;
  }

  getResumen = async (req, res) => {
    res.json(await this.fidelidadService.getResumenAdministrativo());
  };

  getResumenPublico = async (req, res) => {
    const resumen = await this.fidelidadService.getResumenAdministrativo();

    res.json({
      fechaGeneracion: resumen.fechaGeneracion,
      totalClientes: resumen.totalClientes,
      totalCompras: resumen.totalCompras,
      totalVentas: resumen.totalVentas,
      ticketPromedio: resumen.ticketPromedio,
      puntosGenerados: resumen.puntosGenerados,
      recompensasDisponibles: resumen.recompensasDisponibles,
      recompensasEntregadas: resumen.recompensasEntregadas,
      retornoPromedio: resumen.retornoPromedio,
      clientesPorNivel: resumen.clientesPorNivel,
      arquitectura: 'API JSON consumida por frontend Vue/Vite',
      nota: 'Resumen público para evidencia académica, sin datos sensibles de clientes'
    });
  };

  listClientes = async (req, res) => {
    res.json(await this.fidelidadService.getClientesConDetalle());
  };

  createCliente = async (req, res) => {
    const cliente = await this.clienteService.create(req.body);

    let tarjetaEnviada = false;
    try {
      await this.tarjetaFidelidadService.enviarTarjeta(cliente.id);
      tarjetaEnviada = true;
    } catch (err) {
      console.error('No se pudo enviar la tarjeta de fidelidad automáticamente:', err.message);
    }

    res.status(201).json({
      ...cliente,
      puntos: 0,
      nivel: this.fidelidadService.levelStrategy.calculate(0),
      compras: [],
      recompensasEntregadas: [],
      tarjetaEnviada
    });
  };

  enviarTarjeta = async (req, res) => {
    res.json(await this.tarjetaFidelidadService.enviarTarjeta(req.params.id));
  };

  listTarjetasEnviadas = async (req, res) => {
    res.json(await this.tarjetaFidelidadService.listEnviadas());
  };

  updateCliente = async (req, res) => {
    res.json(await this.clienteService.update(req.params.id, req.body));
  };

  deleteCliente = async (req, res) => {
    res.json(await this.clienteService.delete(req.params.id));
  };

  registrarCompra = async (req, res) => {
    res.status(201).json(await this.fidelidadService.registrarCompra(req.body));
  };

  listRecompensas = async (req, res) => {
    res.json(await this.fidelidadService.listRecompensas());
  };

  createRecompensa = async (req, res) => {
    res.status(201).json(await this.fidelidadService.createRecompensa(req.body));
  };

  updateRecompensa = async (req, res) => {
    res.json(await this.fidelidadService.updateRecompensa(req.params.id, req.body));
  };

  deleteRecompensa = async (req, res) => {
    res.json(await this.fidelidadService.deleteRecompensa(req.params.id));
  };

  registrarReclamo = async (req, res) => {
    res.status(201).json(await this.fidelidadService.registrarReclamo(req.body));
  };
}

module.exports = FidelidadController;