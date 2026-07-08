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
async getResumenAdministrativo() {
  const [clientes, compras, recompensas, reclamos] = await Promise.all([
    this.clienteRepository.findAll(),
    this.compraRepository.findAllOrdered(),
    this.recompensaRepository.findAll(),
    this.reclamoRepository.findAllWithReward()
  ]);

  const clientesDetalle = clientes.map((cliente) => this.buildClienteDetalle(cliente, compras, reclamos));
  const clientesAnalizados = clientesDetalle.map((cliente) => this.analizarEstadoCliente(cliente));

  const puntosGenerados = compras.reduce(
    (total, compra) => total + Number(compra.puntos_generados || 0),
    0
  );

  const totalVentas = compras.reduce(
    (total, compra) => total + Number(compra.monto || 0),
    0
  );

  return {
    fechaGeneracion: new Date().toISOString(),
    totalClientes: clientes.length,
    totalCompras: compras.length,
    totalVentas: Number(totalVentas.toFixed(2)),
    ticketPromedio: compras.length ? Number((totalVentas / compras.length).toFixed(2)) : 0,
    puntosGenerados,
    recompensasDisponibles: recompensas.filter((recompensa) => Boolean(recompensa.activo)).length,
    recompensasEntregadas: reclamos.length,
    retornoPromedio: clientesAnalizados.length
      ? Math.round(
          clientesAnalizados.reduce((total, cliente) => total + cliente.probabilidadRetorno, 0) /
            clientesAnalizados.length
        )
      : 0,
    clientesPorNivel: this.getClientesPorNivel(clientesDetalle),
    clientesEnRiesgo: clientesAnalizados
      .filter((cliente) => cliente.estado !== 'Activo')
      .slice(0, 5)
      .map((cliente) => ({
        id: cliente.id,
        nombre: cliente.nombre,
        estado: cliente.estado,
        probabilidadRetorno: cliente.probabilidadRetorno,
        ultimaCompra: cliente.ultimaCompra
      })),
    ultimasCompras: this.getUltimasCompras(clientes, compras)
  };
}

getClientesPorNivel(clientesDetalle) {
  const niveles = ['Bronce', 'Plata', 'Oro'];

  return niveles.map((nivel) => {
    const total = clientesDetalle.filter((cliente) => cliente.nivel === nivel).length;
    return {
      nivel,
      total,
      porcentaje: clientesDetalle.length ? Math.round((total / clientesDetalle.length) * 100) : 0
    };
  });
}

getUltimasCompras(clientes, compras) {
  const clientesPorId = new Map(clientes.map((cliente) => [Number(cliente.id), cliente]));

  return [...compras]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha) || Number(b.id) - Number(a.id))
    .slice(0, 6)
    .map((compra) => ({
      id: compra.id,
      clienteId: compra.cliente_id,
      cliente: clientesPorId.get(Number(compra.cliente_id))?.nombre || 'Cliente no registrado',
      monto: Number(compra.monto),
      fecha: formatFecha(compra.fecha),
      puntosGenerados: Number(compra.puntos_generados || 0)
    }));
}

analizarEstadoCliente(cliente) {
  const compras = [...(cliente.compras || [])].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  if (!compras.length) {
    return {
      ...cliente,
      estado: 'Sin datos',
      probabilidadRetorno: 20,
      ultimaCompra: null
    };
  }

  if (compras.length < 2) {
    return {
      ...cliente,
      estado: 'En observación',
      probabilidadRetorno: 45,
      ultimaCompra: compras[compras.length - 1].fecha
    };
  }

  const intervalo = this.calcularIntervaloPromedio(compras);
  const ultimaCompra = compras[compras.length - 1].fecha;
  const diasDesdeUltima = this.diffDays(ultimaCompra, new Date().toISOString().slice(0, 10));

  let estado = 'Activo';
  let probabilidadRetorno = 90;

  if (diasDesdeUltima > intervalo * 2.2) {
    estado = 'Inactivo';
    probabilidadRetorno = 15;
  } else if (diasDesdeUltima > intervalo * 1.5) {
    estado = 'En riesgo';
    probabilidadRetorno = 35;
  } else if (diasDesdeUltima > intervalo) {
    estado = 'En riesgo';
    probabilidadRetorno = 60;
  }

  return {
    ...cliente,
    estado,
    probabilidadRetorno,
    ultimaCompra
  };
}

calcularIntervaloPromedio(compras) {
  let totalDias = 0;

  for (let i = 1; i < compras.length; i += 1) {
    totalDias += this.diffDays(compras[i - 1].fecha, compras[i].fecha);
  }

  return totalDias / (compras.length - 1);
}

diffDays(fechaInicio, fechaFin) {
  const inicio = new Date(`${String(fechaInicio).slice(0, 10)}T00:00:00`);
  const fin = new Date(`${String(fechaFin).slice(0, 10)}T00:00:00`);
  return Math.round((fin - inicio) / 86400000);
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
