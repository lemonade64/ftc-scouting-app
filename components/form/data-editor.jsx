"use client";

import { useCallback, useEffect, useState } from "react";

import { loadData, updateData } from "@/lib/data";
import { formSchema } from "@/lib/schema";
import { formatCamelCase } from "@/lib/utils";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";

import {
  FileTextIcon,
  ScanIcon,
  UploadIcon,
  Edit2,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

const submissionsArraySchema = z.array(formSchema);

function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function DataEditor() {
  const [showScanner, setShowScanner] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [JSONInput, setJSONInput] = useState("");
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setData(loadData());
  }, []);

  const saveData = (newData) => {
    updateData(newData);
    setData(newData);
  };

  function mergeData(newData) {
    try {
      const parsedData = JSON.parse(newData);
      const validatedData = submissionsArraySchema.parse(parsedData);
      saveData([...data, ...validatedData]);
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
    [data]
  );

  const handleError = useCallback((error) => {
    console.error(error);
    toast.error("Error Scanning QR Code");
  }, []);

  const handleJSONImport = useCallback(() => {
    if (mergeData(JSONInput)) {
      setShowJSONModal(false);
      setJSONInput("");
      toast.success("Successfully Imported JSON");
    }
  }, [JSONInput, data]);

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

  function handleEdit(index, key, value) {
    setEditingCell({ index, key });
    setEditingValue(JSON.stringify(value));
  }

  function handleSave() {
    if (editingCell) {
      const newData = [...data];
      try {
        const updatedEntry = {
          ...newData[editingCell.index],
          [editingCell.key]: JSON.parse(editingValue),
        };
        const validatedEntry = formSchema.parse(updatedEntry);
        newData[editingCell.index] = validatedEntry;
        saveData(newData);
        setEditingCell(null);
        setEditingValue("");
        toast.success("Successfully Updated Entry");
      } catch (error) {
        if (error.errors) {
          const errorMessage = error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");
          toast.error(`Validation Error: ${errorMessage}`);
        } else {
          toast.error("Invalid value");
        }
      }
    }
  }

  function handleDelete(index) {
    const newData = data.filter((_, i) => i !== index);
    saveData(newData);
    toast.success("Successfully Deleted Entry");
  }

  const columns = [
    {
      accessorKey: "key",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Key
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatCamelCase(row.getValue("key")),
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const value = row.getValue("value");
        return JSON.stringify(value);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const index = row.index;
        const key = row.getValue("key");
        const value = row.getValue("value");
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(index, key, value)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">
          Stored Submissions
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {data.map((entry, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <h3 className="text-xl">Entry {index + 1}</h3>
                  <p className="text-md font-light pt-2">
                    Team {entry.teamNumber}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-x-4 p-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-grow">
                      View Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Entry {index + 1} Data</DialogTitle>
                    </DialogHeader>
                    <div className="flex-grow overflow-auto">
                      <DataTable
                        columns={columns}
                        data={Object.entries(entry).map(([key, value]) => ({
                          key,
                          value,
                        }))}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="w-10 h-10 p-0"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
                    value={JSONInput}
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
                    accept=".JSON"
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

        {editingCell && (
          <Dialog
            open={!!editingCell}
            onOpenChange={() => setEditingCell(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Value</DialogTitle>
              </DialogHeader>
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
              />
              <Button onClick={handleSave}>Save</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
