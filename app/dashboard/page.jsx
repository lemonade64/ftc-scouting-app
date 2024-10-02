"use client";

import { useEffect, useState } from "react";

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
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Flag, Target, Users, Zap } from "lucide-react";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const overviewChartConfig = {
  score: {
    label: "Score",
  },
};

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

export default function Dashboard() {
  const [teamData, setTeamData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [currentTeamData, setCurrentTeamData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        const storedData = localStorage.getItem("formSubmissions");
        if (storedData) {
          const data = JSON.parse(storedData);
          setTeamData(data);
          if (data.length > 0) {
            setSelectedTeam(data[0].teamNumber.toString());
          }
        } else {
          console.log("No Data Found");
          setTeamData([]);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setTeamData([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selected = teamData.filter(
      (team) => team.teamNumber.toString() === selectedTeam
    );
    setCurrentTeamData(selected);
  }, [selectedTeam, teamData]);

  function handleTeamChange(teamId) {
    setSelectedTeam(teamId);
  }

  function renderPieChart(data) {
    const pieData = Object.entries(data).map(([name, value]) => ({
      name,
      value: Number(value) || 0,
    }));
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={pieChartConfig} className="min-h-[300px]">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="hsl(var(--chart-1))"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="name"
                position="inside"
                fill="hsl(var(--background))"
                style={{ fontSize: "11px" }}
              />
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
    );
  }

  function calculateScores(data) {
    const autoScore =
      (data.autoBasketHigh || 0) * 8 +
      (data.autoBasketLow || 0) * 4 +
      (data.autoChamberHigh || 0) * 10 +
      (data.autoChamberLow || 0) * 6;
    const teleopScore =
      (data.teleopBasketHigh || 0) * 8 +
      (data.teleopBasketLow || 0) * 4 +
      (data.teleopChamberHigh || 0) * 10 +
      (data.teleopChamberLow || 0) * 6;
    const endgameScore =
      data.endgameAscentLevel === "High"
        ? 30
        : data.endgameAscentLevel === "Low"
        ? 15
        : data.endgameAscentLevel === "Park"
        ? 3
        : 0;
    const totalScore = autoScore + teleopScore + endgameScore;
    return { autoScore, teleopScore, endgameScore, totalScore };
  }

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

  function getAverageData(key) {
    return (
      currentTeamData.reduce((sum, match) => sum + (match[key] || 0), 0) /
      (currentTeamData.length || 1)
    );
  }

  function formatNumber(number) {
    return Number.isFinite(number) ? number.toFixed(1) : "0.0";
  }

  if (teamData.length === 0) {
    return <></>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Select value={selectedTeam} onValueChange={handleTeamChange}>
            <SelectTrigger className="w-[100px] min-[425px]:w-[200px] sm:w-full ml-4">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(teamData.map((team) => team.teamNumber))].map(
                (teamNumber) => (
                  <SelectItem key={teamNumber} value={teamNumber.toString()}>
                    Team {teamNumber} -{" "}
                    {teamData.find((team) => team.teamNumber === teamNumber)
                      ?.teamName || "Unknown"}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
          <TabsTrigger value="teleop">Teleop</TabsTrigger>
          <TabsTrigger value="endgame">Endgame</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                          (a, b) =>
                            a.qualificationNumber - b.qualificationNumber
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
                {renderPieChart({
                  Auto: averageScores.autoScore,
                  Teleop: averageScores.teleopScore,
                  Endgame: averageScores.endgameScore,
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auto">
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
                  }, {})
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Basket Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={autoChartConfig}
                    className="min-h-[300px]"
                  >
                    <BarChart
                      data={[
                        {
                          name: "High",
                          Points: getAverageData("autoBasketHigh"),
                        },
                        {
                          name: "Low",
                          Points: getAverageData("autoBasketLow"),
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
                    config={autoChartConfig}
                    className="min-h-[300px]"
                  >
                    <BarChart
                      data={[
                        {
                          name: "High",
                          Points: getAverageData("autoChamberHigh"),
                        },
                        {
                          name: "Low",
                          Points: getAverageData("autoChamberLow"),
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
        </TabsContent>

        <TabsContent value="teleop">
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
                          Points: getAverageData("teleopBasketHigh"),
                        },
                        {
                          name: "Low",
                          Points: getAverageData("teleopBasketLow"),
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
                          Points: getAverageData("teleopChamberHigh"),
                        },
                        {
                          name: "Low",
                          Points: getAverageData("teleopChamberLow"),
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
                        currentTeamData[0]?.teleopCycleTimes?.map(
                          (_, index) => ({
                            name: `Cycle ${index + 1}`,
                            time:
                              currentTeamData.reduce(
                                (sum, match) =>
                                  sum + (match.teleopCycleTimes?.[index] || 0),
                                0
                              ) / currentTeamData.length,
                          })
                        ) || []
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
        </TabsContent>

        <TabsContent value="endgame">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ascent Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPieChart(
                  currentTeamData.reduce((acc, match) => {
                    acc[match.endgameAscentLevel] =
                      (acc[match.endgameAscentLevel] || 0) + 1;
                    return acc;
                  }, {})
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
                    config={{
                      ascentTime: {
                        label: "Time",
                      },
                    }}
                    className="min-h-[300px]"
                  >
                    <AreaChart
                      data={currentTeamData
                        .sort(
                          (a, b) =>
                            a.qualificationNumber - b.qualificationNumber
                        )
                        .map((match) => ({
                          match: match.qualificationNumber,
                          ascentTime: match.endgameAscentTime,
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
