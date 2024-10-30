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
    Scores: { label: "Scores" },
  };

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
                  name="Scores"
                  dataKey="Scores"
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
                  dataKey="Occurrences"
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
                  dataKey="Scores"
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
                  dataKey="Scores"
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
