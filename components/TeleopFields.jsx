import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { PlusIcon } from "lucide-react";

export default function TeleopFields({ control, setValue }) {
  function incrementField(fieldName, currentValue) {
    setValue(fieldName, currentValue + 1);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { title: "Baskets", fields: ["teleopBasketHigh", "teleopBasketLow"] },
        {
          title: "Chambers",
          fields: ["teleopChamberHigh", "teleopChamberLow"],
        },
      ].map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="font-semibold">{section.title}</h3>
          {section.fields.map((fieldName) => (
            <FormField
              key={fieldName}
              control={control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {fieldName.includes("High") ? "High" : "Low"}
                  </FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => incrementField(fieldName, field.value)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
