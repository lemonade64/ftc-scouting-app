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

export default function TeleopTab({ currentTeamData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Average Basket Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
              <BarChart
                data={[
                  {
                    name: "High",
                    Points: getAverageData(currentTeamData, "teleopBasketHigh"),
                  },
                  {
                    name: "Low",
                    Points: getAverageData(currentTeamData, "teleopBasketLow"),
                  },
                ]}
              >
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
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
              <BarChart
                data={[
                  {
                    name: "High",
                    Points: getAverageData(
                      currentTeamData,
                      "teleopChamberHigh"
                    ),
                  },
                  {
                    name: "Low",
                    Points: getAverageData(currentTeamData, "teleopChamberLow"),
                  },
                ]}
              >
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
      <Card>
        <CardHeader>
          <CardTitle>Cycle Times</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={teleopChartConfig}
              className="min-h-[300px]"
            >
              <AreaChart
                data={
                  currentTeamData[0]?.teleopCycleTimes?.map((_, index) => ({
                    name: `Cycle ${index + 1}`,
                    time:
                      currentTeamData.reduce(
                        (sum, match) =>
                          sum + (match.teleopCycleTimes?.[index] || 0),
                        0
                      ) / currentTeamData.length,
                  })) || []
                }
              >
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
    </div>
  );
}
