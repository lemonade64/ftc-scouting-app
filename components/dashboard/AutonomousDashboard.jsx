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

const autoChartConfig = {
  autoBasketHigh: {
    label: "Basket High",
    color: "hsl(var(--chart-1))",
  },
  autoChamberHigh: {
    label: "Chamber High",
    color: "hsl(var(--chart-2))",
  },
  autoBasketLow: {
    label: "Basket Low",
    color: "hsl(var(--chart-3))",
  },
  autoChamberLow: {
    label: "Chamber Low",
    color: "hsl(var(--chart-4))",
  },
};

export default function AutonomousDashboard({ currentTeamData = [] }) {
  const preloadDistribution = currentTeamData.reduce((acc, match) => {
    acc[match.autoPreload] = (acc[match.autoPreload] || 0) + 1;
    return acc;
  }, {});

  const preloadData = [
    { name: "Specimen", Occurrences: preloadDistribution["Specimen"] || 0 },
    { name: "Sample", Occurrences: preloadDistribution["Sample"] || 0 },
    { name: "Nothing", Occurrences: preloadDistribution["Nothing"] || 0 },
  ];

  const basketData = [
    {
      name: "High",
      Scores: getAverageData(currentTeamData, "autoBasketHigh") || 0,
    },
    {
      name: "Low",
      Scores: getAverageData(currentTeamData, "autoBasketLow") || 0,
    },
  ];

  const chamberData = [
    {
      name: "High",
      Scores: getAverageData(currentTeamData, "autoChamberHigh") || 0,
    },
    {
      name: "Low",
      Scores: getAverageData(currentTeamData, "autoChamberLow") || 0,
    },
  ];

  const radarData = [
    {
      metric: "Basket High",
      Scores: getAverageData(currentTeamData, "autoBasketHigh") || 0,
    },
    {
      metric: "Chamber High",
      Scores: getAverageData(currentTeamData, "autoChamberHigh") || 0,
    },
    {
      metric: "Basket Low",
      Scores: getAverageData(currentTeamData, "autoBasketLow") || 0,
    },
    {
      metric: "Chamber Low",
      Scores: getAverageData(currentTeamData, "autoChamberLow") || 0,
    },
  ];

  function getChart(chartType, data, dataKey, config) {
    return chartType === "bar" ? (
      <ChartContainer config={config}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar
            dataKey={dataKey}
            fill={config[Object.keys(config)[0]].color}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    ) : chartType === "radar" ? (
      <ChartContainer config={config}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Radar
            name="Scores"
            dataKey={dataKey}
            stroke={config[Object.keys(config)[0]].color}
            fill={config[Object.keys(config)[0]].color}
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ChartContainer>
    ) : null;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("radar", radarData, "Scores", autoChartConfig)}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("bar", preloadData, "Occurrences", autoChartConfig)}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Basket Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("bar", basketData, "Scores", autoChartConfig)}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Chamber Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {getChart("bar", chamberData, "Scores", autoChartConfig)}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
