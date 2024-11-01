"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { useTeamData } from "@/hooks/useTeamData";
import { calculateScores } from "@/lib/dashboardManager";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Label, PieChart, Pie, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RootSkeleton } from "@/components/dashboard/DashboardSkeleton";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

function ScoreDonutChart({ autoScore, teleopScore, endgameScore, totalScore }) {
  const data = [
    { name: "Auto", value: autoScore },
    { name: "Teleop", value: teleopScore },
    { name: "Endgame", value: endgameScore },
  ];

  const chartConfig = {
    auto: {
      label: "Auto",
      color: COLORS[0],
    },
    teleop: {
      label: "Teleop",
      color: COLORS[1],
    },
    endgame: {
      label: "Endgame",
      color: COLORS[2],
    },
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ChartContainer config={chartConfig} className="h-[200px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalScore}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-xs"
                      >
                        Total Score
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const { teamData, isLoading } = useTeamData();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("total");

  const uniqueTeams = useMemo(() => {
    const uniqueTeamSet = new Set(
      teamData.map((team) => team.teamNumber.toString())
    );
    return Array.from(uniqueTeamSet).map((teamNumber) => {
      const team = teamData.find((t) => t.teamNumber.toString() === teamNumber);
      const scores = calculateScores(team || {});
      return {
        teamNumber,
        teamName: team?.teamName || "Unknown",
        autoScore: scores.autoScore,
        teleopScore: scores.teleopScore,
        endgameScore: scores.endgameScore,
        totalScore: scores.totalScore,
      };
    });
  }, [teamData]);

  const filteredAndSortedTeams = useMemo(() => {
    return uniqueTeams
      .filter(
        (team) =>
          team.teamNumber.includes(searchQuery) ||
          team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [uniqueTeams, searchQuery, sortBy]);

  if (isLoading) {
    return <RootSkeleton isLoading={isLoading} />;
  }

  return (
    <div className="container mx-auto p-4 mb-10">
      <h1 className="text-3xl font-bold mb-6">Team Overview</h1>
      <div className="flex justify-between mb-6">
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total Score</SelectItem>
            <SelectItem value="auto">Auto Score</SelectItem>
            <SelectItem value="teleop">Teleop Score</SelectItem>
            <SelectItem value="endgame">Endgame Score</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedTeams.map((team) => (
          <Link href={`/dashboard/${team.teamNumber}`} key={team.teamNumber}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">
                  Team {team.teamNumber}
                </h2>
                <p className="text-muted-foreground mb-2">{team.teamName}</p>
                <ScoreDonutChart
                  autoScore={team.autoScore}
                  teleopScore={team.teleopScore}
                  endgameScore={team.endgameScore}
                  totalScore={team.totalScore}
                />
                <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                  <div className="text-center">
                    <div className="font-semibold" style={{ color: COLORS[0] }}>
                      Auto
                    </div>
                    <div>{team.autoScore}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold" style={{ color: COLORS[1] }}>
                      Teleop
                    </div>
                    <div>{team.teleopScore}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold" style={{ color: COLORS[2] }}>
                      Endgame
                    </div>
                    <div>{team.endgameScore}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
