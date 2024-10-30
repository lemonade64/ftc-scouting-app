"use client";

import { useEffect, useState, useMemo } from "react";

import { loadData, updateData } from "@/lib/dataManager";
import { formSchema } from "@/lib/schema";
import { formatCamelCase } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { ArrowUpDown, Edit2, Trash2 } from "lucide-react";

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

export default function DataEditor({ onDataChange }) {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setData(loadData());
  }, []);

  const saveData = (newData) => {
    updateData(newData);
    setData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleEdit = (index, key, value) => {
    setEditingCell({ index, key });
    setEditingValue(JSON.stringify(value));
  };

  const handleSave = () => {
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
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    saveData(newData);
    toast.success("Successfully Deleted Entry");
  };

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "key",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Imported Data</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((entry, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl">Entry {index + 1}</h3>
                  <p className="text-md font-light pt-2">
                    Team {entry.teamNumber}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
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
            </CardContent>
          </Card>
        ))}
      </div>
      {editingCell && (
        <Dialog open={!!editingCell} onOpenChange={() => setEditingCell(null)}>
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
  );
}
