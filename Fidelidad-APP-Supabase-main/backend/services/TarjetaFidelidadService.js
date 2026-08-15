const { buildTarjetaHtml } = require('../utils/tarjetaTemplate');

class TarjetaFidelidadService {
  constructor({ fidelidadService, emailProvider, tarjetaRepository }) {
    this.fidelidadService = fidelidadService;
    this.emailProvider = emailProvider;
    this.tarjetaRepository = tarjetaRepository;
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

    const registro = await this.tarjetaRepository.create({
      cliente_id: cliente.id,
      nivel: cliente.nivel,
      puntos: cliente.puntos
    });

    return { mensaje: `Tarjeta de fidelidad enviada a ${cliente.email}`, tarjeta: registro };
  }

  async listEnviadas() {
    const tarjetas = await this.tarjetaRepository.findAllWithCliente();

    return tarjetas.map((tarjeta) => ({
      id: tarjeta.id,
      clienteId: tarjeta.cliente_id,
      nombre: tarjeta.clientes?.nombre || 'Cliente eliminado',
      email: tarjeta.clientes?.email || '',
      nivel: tarjeta.nivel,
      puntos: tarjeta.puntos,
      fechaEnvio: tarjeta.fecha_envio
    }));
  }

  async listPorCliente(clienteId) {
    await this.fidelidadService.getClienteDetalle(clienteId);
    return this.tarjetaRepository.findByClienteId(clienteId);
  }
}

module.exports = TarjetaFidelidadService;
