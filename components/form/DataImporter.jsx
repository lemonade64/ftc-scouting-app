"use client";

import { useState, useCallback, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import * as z from "zod";

import { formSchema } from "@/lib/schema";
import { loadData, saveData } from "@/lib/dataManager";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { FileTextIcon, ScanIcon, UploadIcon } from "lucide-react";

import DataEditor from "./DataEditor";

const submissionsArraySchema = z.array(formSchema);

export default function DataImporter() {
  const [showScanner, setShowScanner] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [jsonInput, setJSONInput] = useState("");
  const [storedData, setStoredData] = useState([]);
  const [dataEditorKey, setDataEditorKey] = useState(0);

  useEffect(() => {
    setStoredData(loadData());
  }, []);

  function mergeData(newData) {
    try {
      const parsedData = JSON.parse(newData);
      const validatedData = submissionsArraySchema.parse(parsedData);
      saveData(validatedData);
      setStoredData(loadData());
      setDataEditorKey((previousKey) => previousKey + 1);
      return true;
    } catch (error) {
      console.error("Validation Error:", error);
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        toast.error(`Invalid JSON Structure: ${errorMessages}`);
      } else {
        toast.error("Invalid JSON Structure");
      }
      return false;
    }
  }

  const handleScan = useCallback(
    (detectedCodes) => {
      if (detectedCodes && detectedCodes.length > 0) {
        const result = detectedCodes[0].rawValue;
        if (mergeData(result)) {
          setShowScanner(false);
          toast.success("Successfully Imported JSON");
        }
      }
    },
    [storedData]
  );

  const handleError = useCallback((error) => {
    console.error(error);
    toast.error("Error Scanning QR Code");
  }, []);

  const handleJSONImport = useCallback(() => {
    if (mergeData(jsonInput)) {
      setShowJSONModal(false);
      setJSONInput("");
      toast.success("Successfully Imported JSON");
    }
  }, [jsonInput, storedData]);

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
      const parsedJSON = JSON.parse(jsonInput);
      const formattedJSON = JSON.stringify(parsedJSON, null, 2);
      setJSONInput(formattedJSON);
      toast.success("JSON Formatted Successfully");
    } catch (error) {
      toast.error("Invalid JSON");
    }
  }, [jsonInput]);

  const handleDataChange = useCallback((newData) => {
    setStoredData(newData);
  }, []);

  return (
    <section className="container mx-auto py-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Import Data</h1>
        <p className="text-xl text-center">Import Data via QR Code or JSON</p>
        <div className="p-6">
          <div className="flex justify-center space-x-4 mb-6">
            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogTrigger asChild>
                <Button>
                  <ScanIcon className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Scan QR Code</DialogTitle>
                  <DialogDescription>
                    Position the QR Code within the Scanner Area
                  </DialogDescription>
                </DialogHeader>
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                  scanDelay={500}
                  components={{
                    audio: true,
                    torch: true,
                    finder: true,
                  }}
                  styles={{
                    container: {
                      width: "100%",
                      height: "100%",
                    },
                    finderBorder: 4,
                  }}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showJSONModal} onOpenChange={setShowJSONModal}>
              <DialogTrigger asChild>
                <Button>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Import JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Import JSON Data</DialogTitle>
                  <DialogDescription>
                    Paste or Upload your JSON Data
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="col-span-4">JSON Data</Label>
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJSONInput(e.target.value)}
                      className="col-span-4"
                      rows={10}
                      placeholder='[{"teamNumber":1,"teamName":"Example",...}]'
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
                  <Button onClick={handleJSONImport}>Import</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {storedData.length > 0 && (
            <DataEditor key={dataEditorKey} onDataChange={handleDataChange} />
          )}
        </div>
      </div>
    </section>
  );
}
