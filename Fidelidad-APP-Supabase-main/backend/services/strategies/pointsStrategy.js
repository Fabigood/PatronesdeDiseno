class MontoEnteroPointsStrategy {
  calculate(monto) {
    return Math.floor(Number(monto || 0));
  }
}

module.exports = {
  MontoEnteroPointsStrategy
};
