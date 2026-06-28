class FidelidadController {
  constructor({ clienteService, fidelidadService }) {
    this.clienteService = clienteService;
    this.fidelidadService = fidelidadService;
  }

  listClientes = async (req, res) => {
    res.json(await this.fidelidadService.getClientesConDetalle());
  };

  createCliente = async (req, res) => {
    const cliente = await this.clienteService.create(req.body);
    res.status(201).json({
      ...cliente,
      puntos: 0,
      nivel: this.fidelidadService.levelStrategy.calculate(0),
      compras: [],
      recompensasEntregadas: []
    });
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
