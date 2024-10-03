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

import OverviewTab from "@/components/OverviewTab";
import AutonomousTab from "@/components/AutonomousTab";
import TeleopTab from "@/components/TeleopTab";
import EndgameTab from "@/components/EndgameTab";
import DashboardSkeleton from "@/components/DashboardSkeleton";

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
          <OverviewTab currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="auto">
          <AutonomousTab currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="teleop">
          <TeleopTab currentTeamData={currentTeamData} />
        </TabsContent>

        <TabsContent value="endgame">
          <EndgameTab currentTeamData={currentTeamData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
