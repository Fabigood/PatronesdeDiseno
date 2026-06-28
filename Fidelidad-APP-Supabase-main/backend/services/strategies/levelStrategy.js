class ThresholdLevelStrategy {
  constructor(thresholds = { oro: 180, plata: 90 }) {
    this.thresholds = thresholds;
  }

  calculate(puntos) {
    const total = Number(puntos || 0);
    if (total >= this.thresholds.oro) return 'Oro';
    if (total >= this.thresholds.plata) return 'Plata';
    return 'Bronce';
  }
}

module.exports = {
  ThresholdLevelStrategy
};
