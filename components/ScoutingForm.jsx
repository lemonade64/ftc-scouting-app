"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import MetadataFields from "@/components/MetadataFields";
import AutonomousFields from "@/components/AutonomousFields";
import TeleopFields from "@/components/TeleopFields";
import EndgameFields from "@/components/EndgameFields";

const FORM_SECTIONS = ["Metadata", "Auto", "Teleop", "Endgame"];

export default function ScoutingForm({ form, onSubmit, submitButtonText }) {
  const [activeTab, setActiveTab] = useState("metadata");
  const { control, setValue, trigger, formState, handleSubmit } = form;

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await trigger();
      if (result) {
        handleSubmit(onSubmit)();
      } else {
        const errorFields = Object.keys(form.formState.errors)
          .map((field) => field.replace(/([A-Z])/g, " $1").toLowerCase())
          .map((field) =>
            field
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )
          .join(", ");

        toast.error("Validation Error", {
          description: `Please complete the following fields: ${errorFields}`,
        });
      }
    },
    [trigger, handleSubmit, onSubmit, formState.errors]
  );

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {FORM_SECTIONS.map((tab) => (
              <TabsTrigger
                key={tab.toLowerCase()}
                value={tab.toLowerCase()}
                className="flex items-center justify-center"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {FORM_SECTIONS.map((section) => (
            <TabsContent
              key={section.toLowerCase()}
              value={section.toLowerCase()}
            >
              {section === "Metadata" && <MetadataFields control={control} />}
              {section === "Auto" && (
                <AutonomousFields control={control} setValue={setValue} />
              )}
              {section === "Teleop" && (
                <TeleopFields control={control} setValue={setValue} />
              )}
              {section === "Endgame" && <EndgameFields control={control} />}
            </TabsContent>
          ))}
        </Tabs>
        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
