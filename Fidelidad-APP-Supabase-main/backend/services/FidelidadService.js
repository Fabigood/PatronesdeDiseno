const AppError = require('../core/AppError');
const { formatFecha, getMonthAndYear } = require('../utils/dateFormatter');

const ORDEN_NIVEL = { Bronce: 1, Plata: 2, Oro: 3 };

class FidelidadService {
  constructor({
    clienteRepository,
    compraRepository,
    recompensaRepository,
    reclamoRepository,
    pointsStrategy,
    levelStrategy
  }) {
    this.clienteRepository = clienteRepository;
    this.compraRepository = compraRepository;
    this.recompensaRepository = recompensaRepository;
    this.reclamoRepository = reclamoRepository;
    this.pointsStrategy = pointsStrategy;
    this.levelStrategy = levelStrategy;
  }

  async getClientesConDetalle() {
    const [clientes, compras, reclamos] = await Promise.all([
      this.clienteRepository.findAll(),
      this.compraRepository.findAllOrdered(),
      this.reclamoRepository.findAllWithReward()
    ]);

    return clientes.map((cliente) => this.buildClienteDetalle(cliente, compras, reclamos));
  }

  async registrarCompra(payload) {
    const clienteId = this.validateId(payload?.cliente_id, 'Datos de compra inválidos');
    const monto = Number(payload?.monto);
    const fecha = payload?.fecha;

    if (!fecha || !monto || monto <= 0) {
      throw new AppError('Datos de compra inválidos', 400);
    }

    await this.ensureClienteExists(clienteId);

    const puntos = this.pointsStrategy.calculate(monto);

    const data = await this.compraRepository.create({
      cliente_id: clienteId,
      fecha,
      monto,
      puntos_generados: puntos
    });

    return {
      ...data,
      fecha: formatFecha(data.fecha),
      monto: Number(data.monto),
      puntos_generados: Number(data.puntos_generados)
    };
  }

  async listRecompensas() {
    const recompensas = await this.recompensaRepository.findAll();

    return recompensas
      .map((recompensa) => ({
        ...recompensa,
        activo: Boolean(recompensa.activo)
      }))
      .sort((a, b) => this.sortByNivelThenId(a, b));
  }

  async createRecompensa(payload) {
    const recompensa = this.normalizeRecompensa(payload);
    const data = await this.recompensaRepository.create(recompensa);
    return { ...data, activo: Boolean(data.activo) };
  }

  async updateRecompensa(id, payload) {
    const recompensaId = this.validateId(id, 'Recompensa inválida');
    const recompensa = this.normalizeRecompensa(payload);
    const data = await this.recompensaRepository.update(recompensaId, recompensa);

    if (!data) {
      throw new AppError('Recompensa no encontrada', 404);
    }

    return { ...data, activo: Boolean(data.activo) };
  }

  async deleteRecompensa(id) {
    const recompensaId = this.validateId(id, 'Recompensa inválida');
    await this.recompensaRepository.delete(recompensaId);
    return { mensaje: 'Recompensa eliminada' };
  }

  async registrarReclamo(payload) {
    const clienteId = this.validateId(payload?.cliente_id, 'Datos de reclamo inválidos');
    const recompensaId = this.validateId(payload?.recompensa_id, 'Datos de reclamo inválidos');
    const fecha = payload?.fecha;

    if (!fecha) {
      throw new AppError('Datos de reclamo inválidos', 400);
    }

    await this.ensureClienteExists(clienteId);
    await this.ensureRecompensaExists(recompensaId);

    const { mes, anio } = getMonthAndYear(fecha);

    const data = await this.reclamoRepository.create({
      cliente_id: clienteId,
      recompensa_id: recompensaId,
      fecha,
      mes,
      anio
    });

    return {
      ...data,
      fecha: formatFecha(data.fecha)
    };
  }

  buildClienteDetalle(cliente, compras, reclamos) {
    const comprasCliente = compras
      .filter((compra) => Number(compra.cliente_id) === Number(cliente.id))
      .map((compra) => ({
        id: compra.id,
        fecha: formatFecha(compra.fecha),
        monto: Number(compra.monto),
        puntos_generados: Number(compra.puntos_generados)
      }));

    const puntos = comprasCliente.reduce(
      (total, compra) => total + Number(compra.puntos_generados || 0),
      0
    );

    return {
      ...cliente,
      puntos,
      nivel: this.levelStrategy.calculate(puntos),
      compras: comprasCliente,
      recompensasEntregadas: reclamos
        .filter((reclamo) => Number(reclamo.cliente_id) === Number(cliente.id))
        .map((reclamo) => ({
          id: reclamo.id,
          recompensaId: reclamo.recompensa_id,
          recompensa: reclamo.recompensas?.nombre || '',
          tipo: reclamo.recompensas?.tipo || '',
          nivel: reclamo.recompensas?.nivel || '',
          fecha: formatFecha(reclamo.fecha)
        }))
    };
  }

  normalizeRecompensa(payload) {
    const nombre = String(payload?.nombre || '').trim();
    const nivel = payload?.nivel || 'Bronce';
    const tipo = payload?.tipo || 'Producto';
    const detalle = payload?.detalle || '';
    const activo = payload?.activo !== false;

    if (!nombre) {
      throw new AppError('El nombre de la recompensa es obligatorio', 400);
    }

    return { nombre, nivel, tipo, detalle, activo };
  }

  async ensureClienteExists(id) {
    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new AppError('El cliente seleccionado no existe', 400);
    }
  }

  async ensureRecompensaExists(id) {
    const recompensa = await this.recompensaRepository.findById(id);

    if (!recompensa) {
      throw new AppError('La recompensa seleccionada no existe', 400);
    }
  }

  sortByNivelThenId(a, b) {
    const nivelA = ORDEN_NIVEL[a.nivel] || 4;
    const nivelB = ORDEN_NIVEL[b.nivel] || 4;
    if (nivelA !== nivelB) return nivelA - nivelB;
    return Number(a.id) - Number(b.id);
  }

  validateId(id, message) {
    const value = Number(id);
    if (!value) throw new AppError(message, 400);
    return value;
  }
}

module.exports = FidelidadService;
