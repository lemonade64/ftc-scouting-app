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
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const endgameChartConfig = {
  ascentTime: {
    label: "Time",
  },
  "Level 3": {
    label: "Level 3",
    color: "hsl(var(--chart-1))",
  },
  "Level 2": {
    label: "Level 2",
    color: "hsl(var(--chart-2))",
  },
  "Level 1": {
    label: "Level 3",
    color: "hsl(var(--chart-3))",
  },
  "N/A": {
    label: "N/A",
    color: "hsl(var(--chart-4))",
  },
};

export default function EndgameTab({ currentTeamData = [] }) {
  const ascentLevelDistribution = currentTeamData.reduce((acc, match) => {
    const level = match.endgameAscentLevel;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  const ascentLevelData = [
    { name: "Level 3", Occurrences: ascentLevelDistribution["Level 3"] || 0 },
    { name: "Level 2", Occurrences: ascentLevelDistribution["Level 2"] || 0 },
    { name: "Level 1", Occurrences: ascentLevelDistribution["Level 1"] || 0 },
    { name: "N/A", Occurrences: ascentLevelDistribution["N/A"] || 0 },
  ];

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
          <ResponsiveContainer width="100%" height={300}>
            <ChartContainer config={endgameChartConfig}>
              <BarChart data={ascentLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="Occurrences"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                >
                  {ascentLevelData.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey="Occurrences"
                      fill={endgameChartConfig[entry.name].color}
                      name={entry.name}
                    />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ascent Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-1))"
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
