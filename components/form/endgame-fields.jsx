import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Info } from "lucide-react";

export default function EndgameFields({ control }) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="endgameAscentLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ascent Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Ascent Level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Level 3">Level 3</SelectItem>
                <SelectItem value="Level 2">Level 2</SelectItem>
                <SelectItem value="Level 1">Level 1</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endgameAscentTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ascent Time (seconds)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Ascent Time"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="extraNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex flex-row gap-x-2">
              <span>Extra Notes</span>
              <HoverCard>
                <HoverCardTrigger>
                  <Info size={16} />
                </HoverCardTrigger>
                <HoverCardContent className="text-sm font-normal">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Penalties</li>
                    <li>Autonomous Pathing</li>
                    <li>Driver Abilty</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional Comments..."
                {...field}
                className="min-h-[100px]"
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
