import { calculateScores, formatNumber } from "@/lib/dashboard";

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
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Flag, Target, Users, Zap } from "lucide-react";

const overviewChartConfig = {
  score: {
    label: "Points",
    color: "hsl(var(--chart-1))",
  },
};

export default function OverviewDashboard({ currentTeamData = [] }) {
  const averageScores = currentTeamData.reduce((acc, match) => {
    const scores = calculateScores(match);
    Object.keys(scores).forEach((key) => {
      acc[key] = (acc[key] || 0) + scores[key];
    });
    return acc;
  }, {});

  Object.keys(averageScores).forEach((key) => {
    averageScores[key] = averageScores[key] / (currentTeamData.length || 1);
  });

  const performanceData = currentTeamData
    .sort((a, b) => a.qualificationNumber - b.qualificationNumber)
    .map((match) => ({
      match: match.qualificationNumber,
      Points: calculateScores(match).totalScore,
    }));

  const radarData = [
    { metric: "Auto Score", points: averageScores.autoScore || 0 },
    { metric: "Teleop Score", points: averageScores.teleopScore || 0 },
    { metric: "Endgame Score", points: averageScores.endgameScore || 0 },
  ];

  function getChart(chartType, data, dataKey, config) {
    return chartType === "area" ? (
      <ChartContainer config={config}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="match" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={config.score.color}
            fill={config.score.color}
            fillOpacity={0.3}
          />
        </AreaChart>
      </ChartContainer>
    ) : chartType === "radar" ? (
      <ChartContainer config={config}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Radar
            name={config.score.label}
            dataKey={dataKey}
            stroke={config.score.color}
            fill={config.score.color}
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ChartContainer>
    ) : null;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Total Score
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(averageScores.totalScore || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Auto Score
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(averageScores.autoScore || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Teleop Score
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(averageScores.teleopScore || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Endgame Score
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(averageScores.endgameScore || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Across Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {getChart("area", performanceData, "Points", overviewChartConfig)}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {getChart("radar", radarData, "points", overviewChartConfig)}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
