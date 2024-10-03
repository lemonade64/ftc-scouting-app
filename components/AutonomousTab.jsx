import { getAverageData, renderPieChart } from "@/lib/dashboardManager";

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
  autoBasketLow: {
    label: "Basket Low",
  },
  autoChamberHigh: {
    label: "Chamber High",
  },
  autoChamberLow: {
    label: "Chamber Low",
  },
};

const radarChartConfig = {
  team: { label: "Team" },
};

export default function AutonomousTab({ currentTeamData = [] }) {
  const preloadDistribution = currentTeamData.reduce((acc, match) => {
    acc[match.autoPreload] = (acc[match.autoPreload] || 0) + 1;
    return acc;
  }, {});

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
      team: getAverageData(currentTeamData, "autoBasketHigh") || 0,
    },
    {
      metric: "Basket Low",
      team: getAverageData(currentTeamData, "autoBasketLow") || 0,
    },
    {
      metric: "Chamber High",
      team: getAverageData(currentTeamData, "autoChamberHigh") || 0,
    },
    {
      metric: "Chamber Low",
      team: getAverageData(currentTeamData, "autoChamberLow") || 0,
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
                  name="Team"
                  dataKey="team"
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
          {renderPieChart(
            Object.keys(preloadDistribution).length > 0
              ? preloadDistribution
              : { "No Data": 1 },
            autoChartConfig
          )}
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
