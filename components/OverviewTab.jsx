import { calculateScores, formatNumber } from "@/lib/dashboardManager";

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
    label: "Score",
  },
};

const pieChartConfig = {
  Auto: {
    label: "Auto",
  },
  Teleop: {
    label: "Teleop",
  },
  Endgame: {
    label: "Endgame",
  },
};

export default function OverviewTab({ currentTeamData = [] }) {
  const teamNumber = currentTeamData[0]?.teamNumber || "";
  const teamName = currentTeamData[0]?.teamName || "";

  const radarChartConfig = {
    [teamNumber]: { label: teamName },
  };

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
      score: calculateScores(match).totalScore,
    })) || [{ match: "No Data", score: 0 }];

  const radarData = [
    { metric: "Auto Score", [teamNumber]: averageScores.autoScore || 0 },
    { metric: "Teleop Score", [teamNumber]: averageScores.teleopScore || 0 },
    { metric: "Endgame Score", [teamNumber]: averageScores.endgameScore || 0 },
  ];

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
              <ChartContainer
                config={overviewChartConfig}
                className="min-h-[300px]"
              >
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Overall Performance</CardTitle>
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
      </div>
    </>
  );
}
