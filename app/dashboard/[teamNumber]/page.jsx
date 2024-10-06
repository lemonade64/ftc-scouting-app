"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { useTeamData } from "@/hooks/useTeamData";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OverviewDashboard from "@/components/dashboard/OverviewDashboard";
import AutonomousDashboard from "@/components/dashboard/AutonomousDashboard";
import TeleopDashboard from "@/components/dashboard/TeleopDashboard";
import EndgameDashboard from "@/components/dashboard/EndgameDashboard";
import TeamComparison from "@/components/dashboard/TeamComparison";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function TeamDashboard() {
  const params = useParams();
  const teamNumber = params.teamNumber;
  const { teamData, isLoading } = useTeamData();

  if (isLoading) {
    return <DashboardSkeleton isLoading={isLoading} />;
  }

  const currentTeamData = teamData.filter(
    (team) => team.teamNumber.toString() === teamNumber
  );

  if (currentTeamData.length === 0) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-4 mb-10 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team {teamNumber} Dashboard</h1>
        <Button variant="ghost">
          <Link href="/dashboard">Back</Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
          <TabsTrigger value="teleop">Teleop</TabsTrigger>
          <TabsTrigger value="endgame">Endgame</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewDashboard currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="auto">
          <AutonomousDashboard currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="teleop">
          <TeleopDashboard currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="endgame">
          <EndgameDashboard currentTeamData={currentTeamData} />
        </TabsContent>
      </Tabs>

      <TeamComparison teamData={teamData} currentTeam={teamNumber} />
    </div>
  );
}
