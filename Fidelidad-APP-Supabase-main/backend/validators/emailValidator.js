const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DOMINIOS_DESECHABLES = [
  'mailinator.com',
  'trashmail.com',
  'guerrillamail.com',
  'tempmail.com',
  'yopmail.com'
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validarEmail(email) {
  if (!email || typeof email !== 'string') return 'El correo es obligatorio';

  const limpio = normalizeEmail(email);

  if (!EMAIL_REGEX.test(limpio)) {
    return 'El formato del correo no es válido';
  }

  const dominio = limpio.split('@')[1];

  if (DOMINIOS_DESECHABLES.includes(dominio)) {
    return 'No se permiten correos temporales o desechables';
  }

  if (limpio.length > 254) {
    return 'El correo excede la longitud máxima permitida';
  }

  return null;
}

module.exports = {
  normalizeEmail,
  validarEmail
};
