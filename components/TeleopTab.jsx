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

const teleopChartConfig = {
  teleopBasketHigh: {
    label: "Basket High",
  },
  teleopBasketLow: {
    label: "Basket Low",
  },
  teleopChamberHigh: {
    label: "Chamber High",
  },
  teleopChamberLow: {
    label: "Chamber Low",
  },
};

const radarChartConfig = {
  team: { label: "Team" },
};

export default function TeleopTab({ currentTeamData = [] }) {
  const basketData = [
    {
      name: "High",
      Points: getAverageData(currentTeamData, "teleopBasketHigh") || 0,
    },
    {
      name: "Low",
      Points: getAverageData(currentTeamData, "teleopBasketLow") || 0,
    },
  ];

  const chamberData = [
    {
      name: "High",
      Points: getAverageData(currentTeamData, "teleopChamberHigh") || 0,
    },
    {
      name: "Low",
      Points: getAverageData(currentTeamData, "teleopChamberLow") || 0,
    },
  ];

  const cycleTimesData = currentTeamData[0]?.teleopCycleTimes?.map(
    (_, index) => ({
      name: `Cycle ${index + 1}`,
      time:
        currentTeamData.reduce(
          (sum, match) => sum + (match.teleopCycleTimes?.[index] || 0),
          0
        ) / (currentTeamData.length || 1),
    })
  ) || [{ name: "No Data", time: 0 }];

  const radarData = [
    {
      metric: "Basket High",
      team: getAverageData(currentTeamData, "teleopBasketHigh") || 0,
    },
    {
      metric: "Basket Low",
      team: getAverageData(currentTeamData, "teleopBasketLow") || 0,
    },
    {
      metric: "Chamber High",
      team: getAverageData(currentTeamData, "teleopChamberHigh") || 0,
    },
    {
      metric: "Chamber Low",
      team: getAverageData(currentTeamData, "teleopChamberLow") || 0,
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
          <CardTitle>Cycle Times</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
              <AreaChart data={cycleTimesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="time"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
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
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
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
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
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
