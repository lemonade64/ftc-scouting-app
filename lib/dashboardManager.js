import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

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

export function renderPieChart(data, config) {
  const pieData = Object.entries(data).map(([name, value]) => ({
    name,
    value: Number(value) || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={config} className="min-h-[300px]">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="hsl(var(--chart-1))"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
            <LabelList
              dataKey="name"
              position="inside"
              fill="hsl(var(--background))"
              style={{ fontSize: "11px" }}
            />
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
