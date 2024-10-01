"use client";

import { useState, useMemo, useEffect } from "react";

import { loadData } from "@/lib/dataManager";

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
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadarChart,
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

const basketChartConfig = {
  autoBasketHigh: { label: "Auto High" },
  autoBasketLow: { label: "Auto Low" },
  teleopBasketHigh: { label: "Teleop High" },
  teleopBasketLow: { label: "Teleop Low" },
};

const chamberChartConfig = {
  autoChamberHigh: { label: "Auto High" },
  autoChamberLow: { label: "Auto Low" },
  teleopChamberHigh: { label: "Teleop High" },
  teleopChamberLow: { label: "Teleop Low" },
};

const radarChartConfig = {
  team1: { label: "Team 1" },
  team2: { label: "Team 2" },
};

export default function TeamComparison() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [teamsData, setTeamsData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const rawData = loadData();
        const processedData = {};

        rawData.forEach((entry) => {
          const teamNumber = entry.teamNumber.toString();
          if (!processedData[teamNumber]) {
            processedData[teamNumber] = {
              teamNumber,
              autoBasketHigh: 0,
              autoBasketLow: 0,
              teleopBasketHigh: 0,
              teleopBasketLow: 0,
              autoChamberHigh: 0,
              autoChamberLow: 0,
              teleopChamberHigh: 0,
              teleopChamberLow: 0,
              count: 0,
            };
          }

          Object.keys(entry).forEach((key) => {
            if (
              key in processedData[teamNumber] &&
              typeof entry[key] === "number"
            ) {
              processedData[teamNumber][key] += entry[key];
            }
          });
          processedData[teamNumber].count++;
        });

        Object.values(processedData).forEach((team) => {
          Object.keys(team).forEach((key) => {
            if (key !== "teamNumber" && key !== "count") {
              team[key] = parseFloat((team[key] / team.count).toFixed(2));
            }
          });
          delete team.count;
        });

        setTeamsData(processedData);
      } catch (error) {
        console.error("Error Loading Data:", error);
      }
    }
    fetchData();
  }, []);

  function getChartData(config, team1Data, team2Data) {
    return Object.keys(config).map((key) => ({
      metric: config[key].label,
      team1: team1Data ? team1Data[key] : 0,
      team2: team2Data ? team2Data[key] : 0,
    }));
  }

  const basketData = useMemo(() => {
    const team1Data = team1 ? teamsData[team1] : null;
    const team2Data = team2 ? teamsData[team2] : null;
    return getChartData(basketChartConfig, team1Data, team2Data);
  }, [team1, team2, teamsData]);

  const chamberData = useMemo(() => {
    const team1Data = team1 ? teamsData[team1] : null;
    const team2Data = team2 ? teamsData[team2] : null;
    return getChartData(chamberChartConfig, team1Data, team2Data);
  }, [team1, team2, teamsData]);

  const radarData = useMemo(() => {
    const team1Data = team1 ? teamsData[team1] : null;
    const team2Data = team2 ? teamsData[team2] : null;
    return [
      ...Object.keys(basketChartConfig),
      ...Object.keys(chamberChartConfig),
    ].map((key) => ({
      metric: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim(),
      team1: team1Data ? team1Data[key] : 0,
      team2: team2Data ? team2Data[key] : 0,
    }));
  }, [team1, team2, teamsData]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Team Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Select value={team1} onValueChange={setTeam1}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team 1" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(teamsData).map((teamNumber) => (
                  <SelectItem key={teamNumber} value={teamNumber}>
                    Team {teamNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={team2} onValueChange={setTeam2}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team 2" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(teamsData).map((teamNumber) => (
                  <SelectItem key={teamNumber} value={teamNumber}>
                    Team {teamNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="basket" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basket">Baskets</TabsTrigger>
              <TabsTrigger value="chamber">Chambers</TabsTrigger>
              <TabsTrigger value="radar">Overall</TabsTrigger>
            </TabsList>
            <TabsContent value="basket">
              <ResponsiveContainer width="100%" height={350}>
                <ChartContainer config={basketChartConfig}>
                  <BarChart data={basketData} layout="vertical">
                    <CartesianGrid vertical={true} />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="team1"
                      name={team1 ? `Team ${team1}` : "Team 1"}
                      fill="hsl(var(--chart-1))"
                      radius={[0, 5, 5, 0]}
                    />
                    <Bar
                      dataKey="team2"
                      name={team2 ? `Team ${team2}` : "Team 2"}
                      fill="hsl(var(--chart-4))"
                      radius={[0, 5, 5, 0]}
                    />
                    <Legend />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="chamber">
              <ResponsiveContainer width="100%" height={350}>
                <ChartContainer config={chamberChartConfig}>
                  <BarChart data={chamberData} layout="vertical">
                    <CartesianGrid vertical={true} />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="team1"
                      name={team1 ? `Team ${team1}` : "Team 1"}
                      fill="hsl(var(--chart-1))"
                      radius={[0, 5, 5, 0]}
                    />
                    <Bar
                      dataKey="team2"
                      name={team2 ? `Team ${team2}` : "Team 2"}
                      fill="hsl(var(--chart-4))"
                      radius={[0, 5, 5, 0]}
                    />
                    <Legend />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="radar">
              <ResponsiveContainer width="100%" height={350}>
                <ChartContainer config={radarChartConfig}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Radar
                      name={team1 ? `Team ${team1}` : "Team 1"}
                      dataKey="team1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name={team2 ? `Team ${team2}` : "Team 2"}
                      dataKey="team2"
                      stroke="hsl(var(--chart-4))"
                      fill="hsl(var(--chart-4))"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
