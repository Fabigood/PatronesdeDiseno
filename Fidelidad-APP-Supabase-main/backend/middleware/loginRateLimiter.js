const MAX_INTENTOS = 5;
const VENTANA_MS = 10 * 60 * 1000;
const LIMPIEZA_MS = 30 * 60 * 1000;

const intentosPorIp = new Map();

function limpiarExpirados() {
  const ahora = Date.now();
  for (const [ip, registro] of intentosPorIp) {
    if (ahora >= registro.resetAt) intentosPorIp.delete(ip);
  }
}

const limpieza = setInterval(limpiarExpirados, LIMPIEZA_MS);
limpieza.unref();

module.exports = function loginRateLimiter(req, res, next) {
  const ip = req.ip || 'desconocida';
  const ahora = Date.now();
  let registro = intentosPorIp.get(ip);

  if (!registro || ahora >= registro.resetAt) {
    registro = { count: 0, resetAt: ahora + VENTANA_MS };
    intentosPorIp.set(ip, registro);
  }

  if (registro.count >= MAX_INTENTOS) {
    const minutosRestantes = Math.ceil((registro.resetAt - ahora) / 60000);
    return res.status(429).json({
      error: `Demasiados intentos de inicio de sesión. Probá de nuevo en ${minutosRestantes} minuto(s).`
    });
  }

  res.on('finish', () => {
    if (res.statusCode === 401) {
      registro.count += 1;
    } else if (res.statusCode === 200) {
      intentosPorIp.delete(ip);
    }
  });

  next();
};
