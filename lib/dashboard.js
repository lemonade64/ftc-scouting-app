function calculateScore(data, keyPrefix, multipliers) {
  return multipliers.reduce((score, [key, multiplier]) => {
    return score + (data[keyPrefix + key] || 0) * multiplier;
  }, 0);
}

export function calculateScores(data) {
  const autoMultipliers = [
    ["BasketHigh", 8],
    ["BasketLow", 4],
    ["ChamberHigh", 10],
    ["ChamberLow", 6],
  ];

  const teleopMultipliers = [
    ["BasketHigh", 8],
    ["BasketLow", 4],
    ["ChamberHigh", 10],
    ["ChamberLow", 6],
  ];

  const autoScore = calculateScore(data, "auto", autoMultipliers);
  const teleopScore = calculateScore(data, "teleop", teleopMultipliers);

  const endgameScores = {
    Level3: 30,
    Level2: 15,
    Level1: 3,
  };

  const endgameScore = endgameScores[data.endgameAscentLevel] || 0;

  const totalScore = autoScore * 2 + teleopScore + endgameScore;

  return { autoScore, teleopScore, endgameScore, totalScore };
}

export function getAverageData(data, key) {
  if (!Array.isArray(data) || data.length === 0) return 0;

  const sum = data.reduce((acc, match) => acc + (match[key] || 0), 0);
  return sum / data.length;
}

export function formatNumber(number) {
  return Number.isFinite(number) ? number.toFixed(1) : "0.0";
}
