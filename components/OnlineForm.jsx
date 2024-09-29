"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "@/lib/schema";
import { saveData } from "@/lib/dataManager";
import { submitForm } from "@/app/actions/submit";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import ScoutingForm from "@/components/ScoutingForm";

export default function OnlineForm() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamNumber: "",
      teamName: "",
      qualificationNumber: "",
      allianceColour: "",
      autoPreload: "",
      autoBasketHigh: 0,
      autoBasketLow: 0,
      autoChamberHigh: 0,
      autoChamberLow: 0,
      teleopBasketHigh: 0,
      teleopBasketLow: 0,
      teleopChamberHigh: 0,
      teleopChamberLow: 0,
      endgameAscentLevel: "",
      endgameAscentTime: "",
      extraNotes: "",
    },
  });

  const onSubmit = useCallback(
    async (values) => {
      setShowConfirmDialog(false);
      try {
        const result = await submitForm(values);
        if (result.error) {
          toast.error("Error", { description: result.error });
        } else if (result.success) {
          saveData([values]);
          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ message: result.success }), 2000)
            );
          toast.promise(promise, {
            loading: "Submitting...",
            success: (data) => {
              form.reset();
              return `Success: ${data.message}`;
            },
            error: "Form Submission Error.",
          });
        }
      } catch (error) {
        toast.error("Error", {
          description: "Form Submission Error.",
        });
      }
    },
    [form]
  );

  const handleSubmit = useCallback((values) => {
    setShowConfirmDialog(true);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Online Scouting Form
          </CardTitle>
          <CardDescription className="text-xl text-center">
            Record and Export Data via Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScoutingForm
            form={form}
            onSubmit={handleSubmit}
            submitButtonText="Submit Form"
          />
        </CardContent>
      </Card>

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
    </div>
  );
}
