class ClienteController {
  constructor(clienteService) {
    this.clienteService = clienteService;
  }

  list = async (req, res) => {
    res.json(await this.clienteService.list());
  };

  create = async (req, res) => {
    const cliente = await this.clienteService.create(req.body);
    res.status(201).json(this.clienteService.addResumenFidelidad(cliente, req.body?.puntos || 0));
  };

  update = async (req, res) => {
    const cliente = await this.clienteService.update(req.params.id, req.body);
    res.json(this.clienteService.addResumenFidelidad(cliente, req.body?.puntos || 0));
  };

  delete = async (req, res) => {
    res.json(await this.clienteService.delete(req.params.id));
  };
}

module.exports = ClienteController;
