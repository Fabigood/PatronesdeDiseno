const AppError = require('../core/AppError');

module.exports = function errorHandler(err, req, res, next) {
  const isKnownError = err instanceof AppError;
  const statusCode = isKnownError ? err.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    ...(err.details || {})
  });
};
