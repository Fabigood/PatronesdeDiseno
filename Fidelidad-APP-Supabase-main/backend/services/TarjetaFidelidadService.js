const { buildTarjetaHtml } = require('../utils/tarjetaTemplate');

class TarjetaFidelidadService {
  constructor({ fidelidadService, emailProvider }) {
    this.fidelidadService = fidelidadService;
    this.emailProvider = emailProvider;
  }

  async enviarTarjeta(clienteId) {
    const cliente = await this.fidelidadService.getClienteDetalle(clienteId);

    const htmlContent = buildTarjetaHtml({
      id: cliente.id,
      nombre: cliente.nombre,
      nivel: cliente.nivel,
      puntos: cliente.puntos
    });

    await this.emailProvider.send({
      to: cliente.email,
      toName: cliente.nombre,
      subject: `Tu tarjeta de fidelidad ${cliente.nivel} está lista`,
      htmlContent
    });

    return { mensaje: `Tarjeta de fidelidad enviada a ${cliente.email}` };
  }
}

module.exports = TarjetaFidelidadService;
