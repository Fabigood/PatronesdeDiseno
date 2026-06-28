const jwt = require('jsonwebtoken');
const AppError = require('../core/AppError');

class AuthService {
  constructor({ userRepository, jwtSecret }) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async login({ username, password }) {
    const usuario = String(username || '').trim();
    const clave = String(password || '').trim();

    if (!usuario || !clave) {
      throw new AppError('Usuario y contraseña son obligatorios', 400);
    }

    const user = await this.userRepository.findByCredentials(usuario, clave);

    if (!user) {
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    if (!this.jwtSecret) {
      throw new AppError('JWT_SECRET no está configurado en el servidor', 500);
    }

    return jwt.sign(
      { id: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
  }
}

module.exports = AuthService;
