import { getAverageData } from "@/lib/dashboard";

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

const teleopChartConfig = {
  label: "Scores",
  color: "hsl(var(--chart-1))",
};

export default function TeleopDashboard({ currentTeamData, chartConfig }) {
  const currentTeam = currentTeamData[0]?.teamNumber?.toString() || "Unknown";

  const radarData = [
    {
      metric: "Basket High",
      scores: getAverageData(currentTeamData, "teleopBasketHigh"),
    },
    {
      metric: "Chamber High",
      scores: getAverageData(currentTeamData, "teleopChamberHigh"),
    },
    {
      metric: "Basket Low",
      scores: getAverageData(currentTeamData, "teleopBasketLow"),
    },
    {
      metric: "Chamber Low",
      scores: getAverageData(currentTeamData, "teleopChamberLow"),
    },
  ];

  const basketData = [
    {
      name: "High",
      scores: getAverageData(currentTeamData, "teleopBasketHigh"),
    },
    {
      name: "Low",
      scores: getAverageData(currentTeamData, "teleopBasketLow"),
    },
  ];

  const chamberData = [
    {
      name: "High",
      scores: getAverageData(currentTeamData, "teleopChamberHigh"),
    },
    {
      name: "Low",
      scores: getAverageData(currentTeamData, "teleopChamberLow"),
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

  const teamChartConfig =
    chartConfig && currentTeam in chartConfig
      ? chartConfig[currentTeam]
      : teleopChartConfig;

  function getChart(chartType, data, dataKey) {
    const ChartComponent = chartType === "area" ? AreaChart : BarChart;
    const DataComponent = chartType === "area" ? Area : Bar;

    return (
      <ChartContainer config={{ [dataKey]: teamChartConfig }}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <DataComponent
            type={chartType === "area" ? "monotone" : undefined}
            dataKey={dataKey}
            fill={teamChartConfig.color}
            stroke={teamChartConfig.color}
            name={teamChartConfig.label}
            radius={chartType === "bar" ? [5, 5, 0, 0] : undefined}
            fillOpacity={chartType === "area" ? 0.3 : 1}
          />
          <Legend />
        </ChartComponent>
      </ChartContainer>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Teleop Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={{ scores: teamChartConfig }}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Radar
                  name={teamChartConfig.label}
                  dataKey="scores"
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
            {getChart("area", cycleTimeData, "cycleTime")}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Basket Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("bar", basketData, "scores")}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Chamber Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("bar", chamberData, "scores")}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
