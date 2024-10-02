import {
  calculateScores,
  formatNumber,
  renderPieChart,
} from "@/lib/dashboardManager";

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

export default function OverviewTab({ currentTeamData }) {
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
              {formatNumber(averageScores.totalScore)}
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
              {formatNumber(averageScores.autoScore)}
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
              {formatNumber(averageScores.teleopScore)}
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
              {formatNumber(averageScores.endgameScore)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Across Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer
                config={overviewChartConfig}
                className="min-h-[300px]"
              >
                <AreaChart
                  data={currentTeamData
                    .sort(
                      (a, b) => a.qualificationNumber - b.qualificationNumber
                    )
                    .map((match) => ({
                      match: match.qualificationNumber,
                      score: calculateScores(match).totalScore,
                    }))}
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
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Average Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {renderPieChart(
              {
                Auto: averageScores.autoScore,
                Teleop: averageScores.teleopScore,
                Endgame: averageScores.endgameScore,
              },
              pieChartConfig
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
