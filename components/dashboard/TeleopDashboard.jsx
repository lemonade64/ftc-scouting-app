import { getAverageData } from "@/lib/dashboardManager";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
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

export default function TeleopDashboard({ currentTeamData, chartConfig }) {
  const currentTeam = currentTeamData[0]?.teamNumber?.toString() || "Unknown";

  const radarData = [
    {
      metric: "Basket High",
      Scores: getAverageData(currentTeamData, "teleopBasketHigh"),
    },
    {
      metric: "Chamber High",
      Scores: getAverageData(currentTeamData, "teleopChamberHigh"),
    },
    {
      metric: "Basket Low",
      Scores: getAverageData(currentTeamData, "teleopBasketLow"),
    },
    {
      metric: "Chamber Low",
      Scores: getAverageData(currentTeamData, "teleopChamberLow"),
    },
  ];

  const basketData = [
    {
      name: "High",
      Scores: getAverageData(currentTeamData, "teleopBasketHigh"),
    },
    {
      name: "Low",
      Scores: getAverageData(currentTeamData, "teleopBasketLow"),
    },
  ];

  const chamberData = [
    {
      name: "High",
      Scores: getAverageData(currentTeamData, "teleopChamberHigh"),
    },
    {
      name: "Low",
      Scores: getAverageData(currentTeamData, "teleopChamberLow"),
    },
  ];

  const cycleTimeData = currentTeamData
    .sort((a, b) => a.qualificationNumber - b.qualificationNumber)
    .map((match) => ({
      match: `${match.qualificationNumber}`,
      cycleTime:
        match.teleopCycleTimes.reduce((sum, time) => sum + time, 0) /
        match.teleopCycleTimes.length,
    }));

  const defaultChartConfig = {
    label: "Scores",
    color: "hsl(var(--chart-1))",
  };

  const teamChartConfig =
    chartConfig && currentTeam in chartConfig
      ? chartConfig[currentTeam]
      : defaultChartConfig;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Teleop Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={{ Scores: teamChartConfig }}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Radar
                  name={teamChartConfig.label}
                  dataKey="Scores"
                  stroke={teamChartConfig.color}
                  fill={teamChartConfig.color}
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
          <CardTitle>Average Cycle Time Across Qualifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={{ Scores: teamChartConfig }}>
              <AreaChart data={cycleTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="cycleTime"
                  name={teamChartConfig.label}
                  stroke={teamChartConfig.color}
                  fill={teamChartConfig.color}
                  fillOpacity={0.3}
                />
              </AreaChart>
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
            <ChartContainer config={{ [currentTeam]: teamChartConfig }}>
              <BarChart data={basketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="Scores"
                  fill={teamChartConfig.color}
                  name={teamChartConfig.label}
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
            <ChartContainer config={{ Scores: teamChartConfig }}>
              <BarChart data={chamberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="Scores"
                  fill={teamChartConfig.color}
                  name={teamChartConfig.label}
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
