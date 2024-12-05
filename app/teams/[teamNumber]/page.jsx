"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { useTeamData } from "@/hooks/useTeamData";
import { toPng } from "html-to-image";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { Copy, Download, QrCode } from "lucide-react";

import OverviewDashboard from "@/components/dashboard/overview-dashboard";
import AutonomousDashboard from "@/components/dashboard/autonomous-dashboard";
import TeleopDashboard from "@/components/dashboard/teleop-dashboard";
import EndgameDashboard from "@/components/dashboard/endgame-dashboard";
import TeamComparison from "@/components/dashboard/team-comparison";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function TeamDashboard() {
  const { theme, systemTheme } = useTheme();
  const params = useParams();
  const teamNumber = params.teamNumber;
  const { teamData, isLoading } = useTeamData();
  const [showQRModal, setShowQRModal] = useState(false);
  const [QRCodeData, setQRCodeData] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const dashboardRef = useRef(null);
  const [QRBgColour, setQRBgColour] = useState("#ffffff");
  const [QRFgColour, setQRFgColour] = useState("#000000");

  const currentTeamData =
    teamData?.filter((team) => team.teamNumber.toString() === teamNumber) || [];

  const updateQRColours = useCallback(() => {
    const variable = document.documentElement;
    const bg = getComputedStyle(variable)
      .getPropertyValue("--background")
      .trim();
    const fg = getComputedStyle(variable)
      .getPropertyValue("--foreground")
      .trim();
    setQRBgColour(`hsl(${bg})`);
    setQRFgColour(`hsl(${fg})`);
  }, []);

  useEffect(() => {
    updateQRColours();
    window.addEventListener("theme-change", updateQRColours);
    return () => window.removeEventListener("theme-change", updateQRColours);
  }, [updateQRColours]);

  useEffect(() => {
    updateQRColours();
  }, [theme, systemTheme, updateQRColours]);

  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(currentTeamData, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      toast.success("JSON Copied", {
        description: `Team ${teamNumber}'s Data`,
      });
    });
  }, [currentTeamData, teamNumber]);

  const handleQRCode = useCallback(() => {
    const JSONData = JSON.stringify(currentTeamData);
    setQRCodeData(JSONData);
    updateQRColours();

    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Generating QR Code...",
      success: () => {
        setShowQRModal(true);
        return "QR Code Generated";
      },
      error: "Failed to Generate QR Code",
    });
  }, [currentTeamData, updateQRColours]);

  const downloadAsImage = useCallback(() => {
    const activeTabContent = dashboardRef.current?.querySelector(
      `[data-state="active"]`
    );
    if (!activeTabContent) {
      toast.error("Failed to Capture Image");
      return;
    }

    toPng(activeTabContent, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Team_${teamNumber}'s-Dashboard.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Dashboard Captured", {
          description: `${
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          } Image Downloaded`,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to Download Image");
      });
  }, [teamNumber, activeTab]);

  if (isLoading) {
    return <DashboardSkeleton isLoading={isLoading} />;
  }

  if (currentTeamData.length === 0) {
    return notFound();
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-col">
        <div className="container mx-auto p-4 mb-10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Team {teamNumber} Dashboard</h1>
            <Button variant="ghost" asChild>
              <Link href="/teams">Back</Link>
            </Button>
          </div>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="auto">Auto</TabsTrigger>
              <TabsTrigger value="teleop">Teleop</TabsTrigger>
              <TabsTrigger value="endgame">Endgame</TabsTrigger>
            </TabsList>

            <div ref={dashboardRef}>
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
            </div>
          </Tabs>

          <TeamComparison teamData={teamData} currentTeam={teamNumber} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={exportJSON}>
          <Copy className="mr-2 h-4 w-4" />
          Copy JSON
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleQRCode}>
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Code
        </ContextMenuItem>
        <ContextMenuItem onSelect={downloadAsImage}>
          <Download className="mr-2 h-4 w-4" />
          Download as Image
        </ContextMenuItem>
      </ContextMenuContent>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>Scan to Access Team Data</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <QRCodeSVG
              value={QRCodeData}
              bgColor={QRBgColour}
              fgColor={QRFgColour}
              size={256}
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowQRModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
}
