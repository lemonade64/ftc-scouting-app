"use client";

import { useState, useEffect } from "react";

import { formSchema } from "@/lib/schema";
import { loadData, updateData } from "@/lib/dataManager";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

import { Edit2Icon, Trash2Icon, SaveIcon, XIcon } from "lucide-react";

export default function DataEditor({ onDataChange }) {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setData(loadData());
  }, []);

  function saveData(newData) {
    updateData(newData);
    setData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  }

  function handleEdit(index, key, value) {
    setEditingIndex(index);
    setEditingKey(key);
    setEditingValue(JSON.stringify(value));
  }

  function handleSave() {
    if (editingIndex !== null) {
      const newData = [...data];
      try {
        const updatedEntry = {
          ...newData[editingIndex],
          [editingKey]: JSON.parse(editingValue),
        };
        const validatedEntry = formSchema.parse(updatedEntry);
        newData[editingIndex] = validatedEntry;
        saveData(newData);
        setEditingIndex(null);
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

  function handleCancel() {
    setEditingIndex(null);
    setEditingKey("");
    setEditingValue("");
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Imported Data</h2>
      <Accordion type="multiple" className="w-full space-y-2">
        {data.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex justify-between items-center w-full">
                <span>Entry {index + 1}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="mr-2"
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Delete entry</span>
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ml-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(item).map(([key, value]) => (
                      <TableRow key={`${index}-${key}`}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>
                          {editingIndex === index && editingKey === key ? (
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                            />
                          ) : (
                            JSON.stringify(value)
                          )}
                        </TableCell>
                        <TableCell>
                          {editingIndex === index && editingKey === key ? (
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSave}>
                                <SaveIcon className="h-4 w-4" />
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                              >
                                <XIcon className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(index, key, value)}
                            >
                              <Edit2Icon className="h-4 w-4" />
                              <span className="sr-only">Edit {key}</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
