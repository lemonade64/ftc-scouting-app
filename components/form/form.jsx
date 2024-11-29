"use client";

import { useCallback, useEffect, useState } from "react";

import { formSchema } from "@/lib/schema";
import { clearData, loadData, saveData } from "@/lib/data";

import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { Settings, FileTextIcon, TrashIcon, Upload } from "lucide-react";

import ScoutingForm from "@/components/form/scouting-form";
import DataEditor from "@/components/form/data-editor";

export default function Form() {
  const { theme, systemTheme } = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSpreadsheetIDDialog, setShowSpreadsheetIDDialog] = useState(false);
  const [showDataEditorDrawer, setShowDataEditorDrawer] = useState(false);
  const [QRCodeData, setQRCodeData] = useState("");
  const [storedSubmissions, setStoredSubmissions] = useState([]);
  const [QRBgColor, setQRBgColor] = useState("#ffffff");
  const [QRFgColor, setQRFgColor] = useState("#000000");
  const [spreadsheetID, setSpreadsheetID] = useState("");
  const [teams, setTeams] = useState({});
  const [JSONInput, setJSONInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamNumber: undefined,
      teamName: "",
      qualificationNumber: undefined,
      allianceColour: undefined,
      autoPreload: undefined,
      autoBasketHigh: 0,
      autoBasketLow: 0,
      autoChamberHigh: 0,
      autoChamberLow: 0,
      teleopBasketHigh: 0,
      teleopBasketLow: 0,
      teleopChamberHigh: 0,
      teleopChamberLow: 0,
      teleopCycleTimes: [],
      endgameAscentLevel: undefined,
      endgameAscentTime: undefined,
      extraNotes: "",
    },
  });

  const updateQRColors = useCallback(() => {
    const variable = document.documentElement;
    const bg = getComputedStyle(variable)
      .getPropertyValue("--background")
      .trim();
    const fg = getComputedStyle(variable)
      .getPropertyValue("--foreground")
      .trim();
    setQRBgColor(`hsl(${bg})`);
    setQRFgColor(`hsl(${fg})`);
  }, []);

  useEffect(() => {
    setStoredSubmissions(loadData());
    updateQRColors();
    const storedSpreadsheetID = localStorage.getItem("spreadsheetID");
    if (storedSpreadsheetID) {
      setSpreadsheetID(storedSpreadsheetID);
    }
    const storedTeams = localStorage.getItem("teams");
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
    window.addEventListener("theme-change", updateQRColors);
    return () => window.removeEventListener("theme-change", updateQRColors);
  }, [updateQRColors]);

  useEffect(() => {
    updateQRColors();
  }, [theme, systemTheme, updateQRColors]);

  const onSubmit = useCallback(
    async (values) => {
      setShowConfirmDialog(false);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("spreadsheetID", spreadsheetID);

      saveData([values]);
      setStoredSubmissions(loadData());

      if (spreadsheetID) {
        try {
          const result = await submit(formData);
          if (result.success) {
            toast.success("Form Submitted Successfully", {
              description: "Exported Data to Google Sheets",
            });
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error("Error Submitting Form:", error);
          toast.error("Google Sheets Submission Failed", {
            description:
              error.message || "Failed To Submit Form to Google Sheets",
          });
        }
      } else {
        toast.success("Form Submitted Successfully", {
          description: "Data Saved Locally",
        });
      }

      form.reset();
    },
    [form, spreadsheetID]
  );

  const handleSubmit = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const handleExport = useCallback(() => {
    const JSONData = JSON.stringify(storedSubmissions);
    setQRCodeData(JSONData);
    updateQRColors();

    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Generating QR Code...",
      success: () => {
        setShowQRModal(true);
        return "QR Code Generated";
      },
      error: "Failed to Generate QR Code",
    });
  }, [storedSubmissions, updateQRColors]);

  const handleClear = useCallback(() => {
    clearData();
    setStoredSubmissions([]);
    setQRCodeData("");
    toast.success("Local Data Cleared Successfully");
  }, []);

  const handleSpreadsheetIDSave = useCallback(() => {
    localStorage.setItem("spreadsheetID", spreadsheetID);
    setShowSpreadsheetIDDialog(false);
    toast.success("Spreadsheet ID Saved Successfully");
  }, [spreadsheetID]);

  const handleDataChange = useCallback((newData) => {
    setStoredSubmissions(newData);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setJSONInput(content);
      };
      reader.readAsText(file);
    }
  }, []);

  const formatJSON = useCallback(() => {
    try {
      const parsedJSON = JSON.parse(JSONInput);
      const formattedJSON = JSON.stringify(parsedJSON, null, 2);
      setJSONInput(formattedJSON);
      toast.success("JSON Formatted Successfully");
    } catch (error) {
      toast.error("Invalid JSON");
    }
  }, [JSONInput]);

  const handleJSONImport = useCallback(() => {
    try {
      const parsedData = JSON.parse(JSONInput);
      setTeams(parsedData);
      localStorage.setItem("teams", JSON.stringify(parsedData));
      setShowSpreadsheetIDDialog(false);
      setJSONInput("");
      toast.success("Teams Imported Successfully");
    } catch (error) {
      toast.error("Error parsing JSON file");
    }
  }, [JSONInput]);

  return (
    <div className="container mx-auto py-10 min-h-[calc(100vh-8rem)]">
      <section className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Scouting Form</h1>
        <p className="text-xl text-center">
          Record and Export Data via QR Code or Google Sheets
        </p>
        <div className="p-6">
          <ScoutingForm form={form} onSubmit={handleSubmit} />
          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowSpreadsheetIDDialog(true)}
                size="icon"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleExport}
                disabled={storedSubmissions.length === 0}
                size="icon"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleClear}
                variant="destructive"
                disabled={storedSubmissions.length === 0}
                size="icon"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <Drawer
              open={showDataEditorDrawer}
              onOpenChange={setShowDataEditorDrawer}
            >
              <DrawerTrigger asChild>
                <Button variant="link">
                  Stored Submissions: {storedSubmissions.length}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 h-[calc(100vh-10rem)] overflow-auto">
                  <DataEditor onDataChange={handleDataChange} />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </section>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>Scan to Access Form Data</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <QRCodeSVG
              value={QRCodeData}
              bgColor={QRBgColor}
              fgColor={QRFgColor}
              size={256}
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowQRModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showSpreadsheetIDDialog}
        onOpenChange={setShowSpreadsheetIDDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Spreadsheet ID and Teams</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-4">Spreadsheet ID</Label>
              <Input
                value={spreadsheetID}
                onChange={(e) => setSpreadsheetID(e.target.value)}
                className="col-span-3"
              />
              <Button onClick={handleSpreadsheetIDSave} className="col-span-1">
                Save
              </Button>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-4">Teams</Label>
              <Textarea
                value={JSONInput}
                onChange={(e) => setJSONInput(e.target.value)}
                className="col-span-4"
                rows={10}
                placeholder='{"teamNumber":"teamName","11148":"Barker Redbacks",...}'
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-4">Upload JSON</Label>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="col-span-4"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={formatJSON} variant="outline">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Format JSON
            </Button>
            <Button onClick={handleJSONImport}>Import Teams</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
