import { renderPieChart } from "@/lib/dashboardManager";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const endgameChartConfig = {
  ascentTime: {
    label: "Time",
  },
};

export default function EndgameTab({ currentTeamData = [] }) {
  const ascentLevelDistribution = currentTeamData.reduce((acc, match) => {
    acc[match.endgameAscentLevel] = (acc[match.endgameAscentLevel] || 0) + 1;
    return acc;
  }, {});

  const ascentTimeData = currentTeamData
    .sort((a, b) => a.qualificationNumber - b.qualificationNumber)
    .map((match) => ({
      match: match.qualificationNumber,
      ascentTime: match.endgameAscentTime || 0,
    }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ascent Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPieChart(
            Object.keys(ascentLevelDistribution).length > 0
              ? ascentLevelDistribution
              : { "No Data": 1 },
            endgameChartConfig
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ascent Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={endgameChartConfig}
              className="min-h-[300px]"
            >
              <AreaChart
                data={
                  ascentTimeData.length > 0
                    ? ascentTimeData
                    : [{ match: "No Data", ascentTime: 0 }]
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="ascentTime"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
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
