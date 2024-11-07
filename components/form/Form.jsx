"use client";

import { useCallback, useEffect, useState } from "react";

import { submit } from "@/app/actions/submit";
import { loadData, saveData, clearData } from "@/lib/dataManager";
import { formSchema } from "@/lib/schema";

import { QRCodeSVG } from "qrcode.react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Upload, TrashIcon, Settings } from "lucide-react";

import ScoutingForm from "@/components/form/ScoutingForm";
import DataEditor from "@/components/form/DataEditor";

export default function Form() {
  const { theme, systemTheme } = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSpreadsheetIDDialog, setShowSpreadsheetIDDialog] = useState(false);
  const [showDataEditorDialog, setShowDataEditorDialog] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [storedSubmissions, setStoredSubmissions] = useState([]);
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [spreadsheetID, setSpreadsheetID] = useState("");

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
    setQrBgColor(`hsl(${bg})`);
    setQrFgColor(`hsl(${fg})`);
  }, []);

  useEffect(() => {
    setStoredSubmissions(loadData());
    updateQRColors();
    const storedSpreadsheetID = localStorage.getItem("spreadsheetID");
    if (storedSpreadsheetID) {
      setSpreadsheetID(storedSpreadsheetID);
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
    const jsonData = JSON.stringify(storedSubmissions);
    setQrCodeData(jsonData);
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
    setQrCodeData("");
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

  return (
    <div className="container mx-auto py-10">
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
            <Dialog
              open={showDataEditorDialog}
              onOpenChange={setShowDataEditorDialog}
            >
              <DialogTrigger asChild>
                {storedSubmissions.length > 0 && (
                  <Button variant="link">
                    Stored Submissions: {storedSubmissions.length}
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Stored Submissions</DialogTitle>
                  <DialogDescription>
                    View and edit your stored submissions
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-auto">
                  <DataEditor onDataChange={handleDataChange} />
                </div>
              </DialogContent>
            </Dialog>
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
              value={qrCodeData}
              bgColor={qrBgColor}
              fgColor={qrFgColor}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Spreadsheet ID</DialogTitle>
            <DialogDescription>
              Required for Google Sheets Integration{" "}
              <span className="font-bold">(optional)</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-x-4">
            <Input
              value={spreadsheetID}
              onChange={(e) => setSpreadsheetID(e.target.value)}
            />
            <Button onClick={handleSpreadsheetIDSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
