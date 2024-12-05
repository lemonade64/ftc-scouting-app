import { getAverageData } from "@/lib/dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function EndgameComparison({
  currentTeamData,
  comparisonTeamData,
  currentTeam,
  comparisonTeam,
  chartConfig,
}) {
  const ascentLevels = ["Level 3", "Level 2", "Level 1", "N/A"];
  function getAscentLevelDistribution(data) {
    const distribution = data.reduce((acc, match) => {
      acc[match.endgameAscentLevel] = (acc[match.endgameAscentLevel] || 0) + 1;
      return acc;
    }, {});
    return ascentLevels.map((level) => ({
      level,
      [data === currentTeamData ? currentTeam : comparisonTeam]:
        ((distribution[level] || 0) / data.length) * 100,
    }));
  }

  const currentTeamAscentDistribution =
    getAscentLevelDistribution(currentTeamData);
  const comparisonTeamAscentDistribution =
    getAscentLevelDistribution(comparisonTeamData);

  const ascentLevelData = ascentLevels.map((level) => ({
    level,
    [currentTeam]: currentTeamAscentDistribution.find(
      (item) => item.level === level
    )[currentTeam],
    [comparisonTeam]: comparisonTeamAscentDistribution.find(
      (item) => item.level === level
    )[comparisonTeam],
  }));

  const ascentTimeData = [
    {
      name: "Average Ascent Time",
      [currentTeam]: getAverageData(currentTeamData, "endgameAscentTime"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "endgameAscentTime"),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ascent Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <BarChart data={ascentLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey={currentTeam}
                  fill={chartConfig[currentTeam].color}
                  name={chartConfig[currentTeam].label}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey={comparisonTeam}
                  fill={chartConfig[comparisonTeam].color}
                  name={chartConfig[comparisonTeam].label}
                  radius={[5, 5, 0, 0]}
                />
                <Legend />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Ascent Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <BarChart data={ascentTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey={currentTeam}
                  fill={chartConfig[currentTeam].color}
                  name={chartConfig[currentTeam].label}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey={comparisonTeam}
                  fill={chartConfig[comparisonTeam].color}
                  name={chartConfig[comparisonTeam].label}
                  radius={[5, 5, 0, 0]}
                />
                <Legend />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
