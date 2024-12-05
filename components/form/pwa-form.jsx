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
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { Upload, TrashIcon } from "lucide-react";

import ScoutingForm from "@/components/form/scouting-form";
import DataEditor from "@/components/form/data-editor";

export default function PWAForm() {
  const { theme, systemTheme } = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDataEditorDrawer, setShowDataEditorDrawer] = useState(false);
  const [QRCodeData, setQRCodeData] = useState("");
  const [storedSubmissions, setStoredSubmissions] = useState([]);
  const [QRBgColour, setQRBgColour] = useState("#ffffff");
  const [QRFgColour, setQRFgColour] = useState("#000000");

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
      autoAscentLevel: undefined,
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
    setStoredSubmissions(loadData());
    updateQRColours();
    window.addEventListener("theme-change", updateQRColours);
    return () => window.removeEventListener("theme-change", updateQRColours);
  }, [updateQRColours]);

  useEffect(() => {
    updateQRColours();
  }, [theme, systemTheme, updateQRColours]);

  const onSubmit = useCallback(
    (values) => {
      setShowConfirmDialog(false);
      saveData([values]);
      setStoredSubmissions(loadData());

      toast.success("Form Submitted Successfully", {
        description: "Data Saved Locally",
      });

      form.reset();
    },
    [form]
  );

  const handleSubmit = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  const handleExport = useCallback(() => {
    const JSONData = JSON.stringify(storedSubmissions);
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
  }, [storedSubmissions, updateQRColours]);

  const handleClear = useCallback(() => {
    clearData();
    setStoredSubmissions([]);
    setQRCodeData("");
    toast.success("Local Data Cleared Successfully");
  }, []);

  const handleDataChange = useCallback((newData) => {
    setStoredSubmissions(newData);
  }, []);

  return (
    <div className="container mx-auto py-10 min-h-[calc(100vh-8rem)]">
      <section className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">PWA Scouting Form</h1>
        <p className="text-xl text-center">
          Record and Export Data via QR Code
        </p>
        <div className="p-6">
          <ScoutingForm form={form} onSubmit={handleSubmit} />
          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-2">
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
    </div>
  );
}
