const AppError = require('../core/AppError');
const { normalizeEmail, validarEmail } = require('../validators/emailValidator');

class ClienteService {
  constructor({ clienteRepository, levelStrategy }) {
    this.clienteRepository = clienteRepository;
    this.levelStrategy = levelStrategy;
  }

  async list() {
    return this.clienteRepository.findAll();
  }

  async create(payload) {
    const cliente = this.normalizeAndValidate(payload);
    await this.ensureEmailAvailable(cliente.email);
    return this.clienteRepository.create(cliente);
  }

  async update(id, payload) {
    const clienteId = this.validateId(id, 'Cliente inválido');
    const cliente = this.normalizeAndValidate(payload);
    await this.ensureEmailAvailable(cliente.email, clienteId);

    const updated = await this.clienteRepository.update(clienteId, cliente);

    if (!updated) {
      throw new AppError('Cliente no encontrado', 404);
    }

    return updated;
  }

  async delete(id) {
    const clienteId = this.validateId(id, 'Cliente inválido');
    await this.clienteRepository.delete(clienteId);
    return { mensaje: 'Cliente eliminado' };
  }

  addResumenFidelidad(cliente, puntos = 0) {
    return {
      ...cliente,
      puntos: Number(puntos || 0),
      nivel: this.levelStrategy.calculate(puntos)
    };
  }

  normalizeAndValidate(payload) {
    const nombre = String(payload?.nombre || '').trim();
    const email = normalizeEmail(payload?.email);

    if (!nombre || !email) {
      throw new AppError('El nombre y el correo son obligatorios', 400);
    }

    const emailError = validarEmail(email);
    if (emailError) {
      throw new AppError(emailError, 422, { campo: 'email' });
    }

    return { nombre, email };
  }

  async ensureEmailAvailable(email, exceptId = null) {
    const duplicados = await this.clienteRepository.findDuplicatedEmail(email, exceptId);

    if (duplicados.length > 0) {
      throw new AppError('El correo ya está registrado por otro cliente', 409, { campo: 'email' });
    }
  }

  validateId(id, message) {
    const value = Number(id);
    if (!value) throw new AppError(message, 400);
    return value;
  }
}

module.exports = ClienteService;
