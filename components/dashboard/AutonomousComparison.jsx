import { getAverageData } from "@/lib/dashboardManager";

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
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function AutonomousComparison({
  currentTeamData,
  comparisonTeamData,
  currentTeam,
  comparisonTeam,
  chartConfig,
}) {
  const radarData = [
    {
      metric: "Basket High",
      [currentTeam]: getAverageData(currentTeamData, "autoBasketHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoBasketHigh"),
    },
    {
      metric: "Chamber High",
      [currentTeam]: getAverageData(currentTeamData, "autoChamberHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoChamberHigh"),
    },
    {
      metric: "Basket Low",
      [currentTeam]: getAverageData(currentTeamData, "autoBasketLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoBasketLow"),
    },
    {
      metric: "Chamber Low",
      [currentTeam]: getAverageData(currentTeamData, "autoChamberLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoChamberLow"),
    },
  ];

  const basketData = [
    {
      name: "High",
      [currentTeam]: getAverageData(currentTeamData, "autoBasketHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoBasketHigh"),
    },
    {
      name: "Low",
      [currentTeam]: getAverageData(currentTeamData, "autoBasketLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoBasketLow"),
    },
  ];

  const chamberData = [
    {
      name: "High",
      [currentTeam]: getAverageData(currentTeamData, "autoChamberHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoChamberHigh"),
    },
    {
      name: "Low",
      [currentTeam]: getAverageData(currentTeamData, "autoChamberLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "autoChamberLow"),
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Radar
                  name={chartConfig[currentTeam].label}
                  dataKey={currentTeam}
                  stroke={chartConfig[currentTeam].color}
                  fill={chartConfig[currentTeam].color}
                  fillOpacity={0.6}
                />
                <Radar
                  name={chartConfig[comparisonTeam].label}
                  dataKey={comparisonTeam}
                  stroke={chartConfig[comparisonTeam].color}
                  fill={chartConfig[comparisonTeam].color}
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Basket Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <BarChart data={basketData}>
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
      <Card>
        <CardHeader>
          <CardTitle>Average Chamber Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <BarChart data={chamberData}>
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
