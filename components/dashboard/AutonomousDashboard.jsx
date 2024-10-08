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
  },
  autoChamberHigh: {
    label: "Chamber High",
  },
  autoBasketLow: {
    label: "Basket Low",
  },
  autoChamberLow: {
    label: "Chamber Low",
  },
};

export default function AutonomousTab({ currentTeamData = [] }) {
  const teamNumber = currentTeamData[0]?.teamNumber || "";
  const teamName = currentTeamData[0]?.teamName || "";

  const radarChartConfig = {
    [teamNumber]: { label: teamName },
  };

  const preloadDistribution = currentTeamData.reduce((acc, match) => {
    acc[match.autoPreload] = (acc[match.autoPreload] || 0) + 1;
    return acc;
  }, {});

  const preloadData = [
    { name: "Specimen", count: preloadDistribution["Specimen"] || 0 },
    { name: "Sample", count: preloadDistribution["Sample"] || 0 },
    { name: "Nothing", count: preloadDistribution["Nothing"] || 0 },
  ];

  const basketData = [
    {
      name: "High",
      Points: getAverageData(currentTeamData, "autoBasketHigh") || 0,
    },
    {
      name: "Low",
      Points: getAverageData(currentTeamData, "autoBasketLow") || 0,
    },
  ];

  const chamberData = [
    {
      name: "High",
      Points: getAverageData(currentTeamData, "autoChamberHigh") || 0,
    },
    {
      name: "Low",
      Points: getAverageData(currentTeamData, "autoChamberLow") || 0,
    },
  ];

  const radarData = [
    {
      metric: "Basket High",
      [teamNumber]: getAverageData(currentTeamData, "autoBasketHigh") || 0,
    },
    {
      metric: "Chamber High",
      [teamNumber]: getAverageData(currentTeamData, "autoChamberHigh") || 0,
    },
    {
      metric: "Basket Low",
      [teamNumber]: getAverageData(currentTeamData, "autoBasketLow") || 0,
    },
    {
      metric: "Chamber Low",
      [teamNumber]: getAverageData(currentTeamData, "autoChamberLow") || 0,
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
            <ChartContainer config={radarChartConfig}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Radar
                  name={teamName}
                  dataKey={teamNumber}
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
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
          <CardTitle>Preload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={autoChartConfig} className="min-h-[300px]">
              <BarChart data={preloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-3))"
                  radius={[5, 5, 0, 0]}
                />
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
            <ChartContainer config={autoChartConfig} className="min-h-[300px]">
              <BarChart data={basketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="Points"
                  fill="hsl(var(--chart-1))"
                  radius={[5, 5, 0, 0]}
                />
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
            <ChartContainer config={autoChartConfig} className="min-h-[300px]">
              <BarChart data={chamberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="Points"
                  fill="hsl(var(--chart-2))"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
