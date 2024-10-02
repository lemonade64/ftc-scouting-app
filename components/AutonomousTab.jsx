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

export default function AutonomousTab({ currentTeamData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Preload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPieChart(
            currentTeamData.reduce((acc, match) => {
              acc[match.autoPreload] = (acc[match.autoPreload] || 0) + 1;
              return acc;
            }, {}),
            autoChartConfig
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Basket Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={autoChartConfig} className="min-h-[300px]">
              <BarChart
                data={[
                  {
                    name: "High",
                    Points: getAverageData(currentTeamData, "autoBasketHigh"),
                  },
                  {
                    name: "Low",
                    Points: getAverageData(currentTeamData, "autoBasketLow"),
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
            <ChartContainer config={autoChartConfig} className="min-h-[300px]">
              <BarChart
                data={[
                  {
                    name: "High",
                    Points: getAverageData(currentTeamData, "autoChamberHigh"),
                  },
                  {
                    name: "Low",
                    Points: getAverageData(currentTeamData, "autoChamberLow"),
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
    </div>
  );
}
