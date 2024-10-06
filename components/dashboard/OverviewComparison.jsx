import { useMemo } from "react";

import { formatNumber } from "@/lib/dashboardManager";

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

import {
  ArrowDownIcon,
  ArrowUpIcon,
  Flag,
  Target,
  Users,
  Zap,
} from "lucide-react";

function calculatePercentageDifference(current, comparison) {
  if (typeof current !== "number" || typeof comparison !== "number") {
    return null;
  }
  if (current === 0 && comparison === 0) return 0;
  if (current === 0) return comparison > 0 ? 100 : -100;
  const diff = ((comparison - current) / current) * 100;
  return parseFloat(diff.toFixed(2));
}

export default function OverviewComparison({
  currentTeam,
  comparisonTeam,
  currentTeamMetrics,
  comparisonTeamMetrics,
  chartConfig,
}) {
  const metrics = useMemo(
    () => [
      {
        name: "Total Score",
        value: comparisonTeamMetrics.totalScore,
        currentValue: currentTeamMetrics.totalScore,
        icon: Target,
      },
      {
        name: "Auto Score",
        value: comparisonTeamMetrics.autoScore,
        currentValue: currentTeamMetrics.autoScore,
        icon: Zap,
      },
      {
        name: "Teleop Score",
        value: comparisonTeamMetrics.teleopScore,
        currentValue: currentTeamMetrics.teleopScore,
        icon: Users,
      },
      {
        name: "Endgame Score",
        value: comparisonTeamMetrics.endgameScore,
        currentValue: currentTeamMetrics.endgameScore,
        icon: Flag,
      },
    ],
    [currentTeamMetrics, comparisonTeamMetrics]
  );

  const averagePerformanceData = useMemo(
    () => [
      {
        name: "Average Total Score",
        [currentTeam]: currentTeamMetrics.totalScore,
        [comparisonTeam]: comparisonTeamMetrics.totalScore,
      },
    ],
    [currentTeamMetrics, comparisonTeamMetrics, currentTeam, comparisonTeam]
  );

  const radarData = useMemo(
    () => [
      {
        metric: "Auto Score",
        [currentTeam]: currentTeamMetrics.autoScore,
        [comparisonTeam]: comparisonTeamMetrics.autoScore,
      },
      {
        metric: "Teleop Score",
        [currentTeam]: currentTeamMetrics.teleopScore,
        [comparisonTeam]: comparisonTeamMetrics.teleopScore,
      },
      {
        metric: "Endgame Score",
        [currentTeam]: currentTeamMetrics.endgameScore,
        [comparisonTeam]: comparisonTeamMetrics.endgameScore,
      },
    ],
    [currentTeam, comparisonTeam, currentTeamMetrics, comparisonTeamMetrics]
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {metrics.map((metric) => {
          const difference = calculatePercentageDifference(
            metric.currentValue,
            metric.value
          );
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average {metric.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    difference > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatNumber(metric.value)}
                </div>
                {difference !== null && (
                  <p
                    className={`text-xs ${
                      difference > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {difference > 0 ? (
                      <ArrowUpIcon className="inline h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="inline h-4 w-4" />
                    )}
                    {Math.abs(difference)}%
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Total Score Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <BarChart data={averagePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    dataKey={currentTeam}
                    fill={chartConfig[currentTeam].color}
                    name={chartConfig[currentTeam].label}
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey={comparisonTeam}
                    fill={chartConfig[comparisonTeam].color}
                    name={chartConfig[comparisonTeam].label}
                    radius={[5, 5, 0, 0]}
                  />
                  <Legend />
                </BarChart>
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
              <ChartContainer config={chartConfig}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Radar
                    name={chartConfig[currentTeam].label}
                    dataKey={currentTeam}
                    stroke={chartConfig[currentTeam].color}
                    fill={chartConfig[currentTeam].color}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name={chartConfig[comparisonTeam].label}
                    dataKey={comparisonTeam}
                    stroke={chartConfig[comparisonTeam].color}
                    fill={chartConfig[comparisonTeam].color}
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
