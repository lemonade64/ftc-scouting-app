"use client";

import { useTeamData } from "@/hooks/useTeamData";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OverviewDashboard from "@/components/dashboard/OverviewDashboard";
import AutonomousDashboard from "@/components/dashboard/AutonomousDashboard";
import TeleopDashboard from "@/components/dashboard/TeleopDashboard";
import EndgameDashboard from "@/components/dashboard/EndgameDashboard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import TeamComparison from "@/components/dashboard/TeamComparison";

export default function Dashboard() {
  const {
    teamData,
    selectedTeam,
    currentTeamData,
    handleTeamChange,
    isLoading,
  } = useTeamData();

  if (isLoading) {
    return <DashboardSkeleton isLoading={isLoading} />;
  }

  return (
    <div className="container mx-auto p-4 mb-10 flex flex-col">
      <>
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
      </>

      <TeamComparison teamData={teamData} currentTeam={selectedTeam} />
    </div>
  );
}
