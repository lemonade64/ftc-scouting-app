"use client";

import { useState, useEffect, useMemo } from "react";

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

const radarChartConfig = {
  team1: {
    label: "Team 1",
  },
};

const emptyData = [
  { name: "Basket High", value: 0 },
  { name: "Basket Low", value: 0 },
  { name: "Chamber High", value: 0 },
  { name: "Chamber Low", value: 0 },
];

const emptyRadarData = [
  { metric: "Auto Basket High", value: 0 },
  { metric: "Auto Basket Low", value: 0 },
  { metric: "Auto Chamber High", value: 0 },
  { metric: "Auto Chamber Low", value: 0 },
  { metric: "Teleop Basket High", value: 0 },
  { metric: "Teleop Basket Low", value: 0 },
  { metric: "Teleop Chamber High", value: 0 },
  { metric: "Teleop Chamber Low", value: 0 },
];

export default function TeamAnalysis() {
  const [teamsData, setTeamsData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");

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

  const autoData = useMemo(() => {
    if (!selectedTeam || !teamsData[selectedTeam]) return emptyData;
    const teamData = teamsData[selectedTeam];
    return [
      { name: "Basket High", value: teamData.autoBasketHigh },
      { name: "Basket Low", value: teamData.autoBasketLow },
      { name: "Chamber High", value: teamData.autoChamberHigh },
      { name: "Chamber Low", value: teamData.autoChamberLow },
    ];
  }, [selectedTeam, teamsData]);

  const teleopData = useMemo(() => {
    if (!selectedTeam || !teamsData[selectedTeam]) return emptyData;
    const teamData = teamsData[selectedTeam];
    return [
      { name: "Basket High", value: teamData.teleopBasketHigh },
      { name: "Basket Low", value: teamData.teleopBasketLow },
      { name: "Chamber High", value: teamData.teleopChamberHigh },
      { name: "Chamber Low", value: teamData.teleopChamberLow },
    ];
  }, [selectedTeam, teamsData]);

  const radarData = useMemo(() => {
    if (!selectedTeam || !teamsData[selectedTeam]) return emptyRadarData;
    const teamData = teamsData[selectedTeam];
    return [
      {
        metric: "Auto Basket High",
        value: teamData.autoBasketHigh,
      },
      {
        metric: "Auto Basket Low",
        value: teamData.autoBasketLow,
      },
      {
        metric: "Auto Chamber High",
        value: teamData.autoChamberHigh,
      },
      {
        metric: "Auto Chamber Low",
        value: teamData.autoChamberLow,
      },
      {
        metric: "Teleop Basket High",
        value: teamData.teleopBasketHigh,
      },
      {
        metric: "Teleop Basket Low",
        value: teamData.teleopBasketLow,
      },
      {
        metric: "Teleop Chamber High",
        value: teamData.teleopChamberHigh,
      },
      {
        metric: "Teleop Chamber Low",
        value: teamData.teleopChamberLow,
      },
    ];
  }, [selectedTeam, teamsData]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Team Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team" />
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
          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auto">Auto</TabsTrigger>
              <TabsTrigger value="teleop">Teleop</TabsTrigger>
              <TabsTrigger value="overall">Overall</TabsTrigger>
            </TabsList>
            <TabsContent value="auto">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={autoChartConfig}
                  className="min-h-[350px]"
                >
                  <BarChart data={autoData}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis tickMargin={10} axisLine={true} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--chart-4))"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="teleop">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={teleopChartConfig}
                  className="min-h-[350px]"
                >
                  <BarChart data={teleopData}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis tickMargin={10} axisLine={true} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--chart-4))"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="overall">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={radarChartConfig}
                  className="min-h-[350px]"
                >
                  <RadarChart data={radarData} className="w-full h-full">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <Radar
                      name={
                        selectedTeam
                          ? `Team ${selectedTeam}`
                          : "No Team Selected"
                      }
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-4))"
                      fillOpacity={0.6}
                      dot={{
                        r: 3,
                        fillOpacity: 1,
                      }}
                    />
                    <Legend />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
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
