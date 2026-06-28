function formatFecha(fecha) {
  if (!fecha) return fecha;
  return String(fecha).slice(0, 10);
}

function getMonthAndYear(fecha) {
  const date = new Date(`${fecha}T00:00:00`);
  return {
    mes: date.getMonth() + 1,
    anio: date.getFullYear()
  };
}

module.exports = {
  formatFecha,
  getMonthAndYear
};
