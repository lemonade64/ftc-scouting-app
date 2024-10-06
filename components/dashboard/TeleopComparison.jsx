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

export default function TeleopComparison({
  currentTeamData,
  comparisonTeamData,
  currentTeam,
  comparisonTeam,
  currentTeamMetrics,
  comparisonTeamMetrics,
  chartConfig,
}) {
  const radarData = [
    {
      metric: "Basket High",
      [currentTeam]: getAverageData(currentTeamData, "teleopBasketHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopBasketHigh"),
    },
    {
      metric: "Basket Low",
      [currentTeam]: getAverageData(currentTeamData, "teleopBasketLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopBasketLow"),
    },
    {
      metric: "Chamber High",
      [currentTeam]: getAverageData(currentTeamData, "teleopChamberHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopChamberHigh"),
    },
    {
      metric: "Chamber Low",
      [currentTeam]: getAverageData(currentTeamData, "teleopChamberLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopChamberLow"),
    },
  ];

  const basketData = [
    {
      name: "High",
      [currentTeam]: getAverageData(currentTeamData, "teleopBasketHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopBasketHigh"),
    },
    {
      name: "Low",
      [currentTeam]: getAverageData(currentTeamData, "teleopBasketLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopBasketLow"),
    },
  ];

  const chamberData = [
    {
      name: "High",
      [currentTeam]: getAverageData(currentTeamData, "teleopChamberHigh"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopChamberHigh"),
    },
    {
      name: "Low",
      [currentTeam]: getAverageData(currentTeamData, "teleopChamberLow"),
      [comparisonTeam]: getAverageData(comparisonTeamData, "teleopChamberLow"),
    },
  ];

  const cycleTimeData = [
    {
      name: "Average Cycle Time",
      [currentTeam]: currentTeamMetrics.averageCycleTime,
      [comparisonTeam]: comparisonTeamMetrics.averageCycleTime,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Teleop Overview</CardTitle>
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
          <CardTitle>Average Cycle Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={chartConfig}>
              <BarChart data={cycleTimeData}>
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
