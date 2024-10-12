export function calculateScores(data) {
  const autoScore =
    (data.autoBasketHigh || 0) * 8 +
    (data.autoBasketLow || 0) * 4 +
    (data.autoChamberHigh || 0) * 10 +
    (data.autoChamberLow || 0) * 6;
  const teleopScore =
    (data.teleopBasketHigh || 0) * 8 +
    (data.teleopBasketLow || 0) * 4 +
    (data.teleopChamberHigh || 0) * 10 +
    (data.teleopChamberLow || 0) * 6;
  const endgameScore =
    data.endgameAscentLevel === "High"
      ? 30
      : data.endgameAscentLevel === "Low"
      ? 15
      : data.endgameAscentLevel === "Park"
      ? 3
      : 0;
  const totalScore = autoScore + teleopScore + endgameScore;
  return { autoScore, teleopScore, endgameScore, totalScore };
}

export function getAverageData(data, key) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return 0;
  }

  const sum = data.reduce((acc, match) => acc + (match[key] || 0), 0);
  return sum / data.length;
}

export function formatNumber(number) {
  return Number.isFinite(number) ? number.toFixed(1) : "0.0";
}
