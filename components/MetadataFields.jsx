import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MetadataFields({ control }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="teamNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Number</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Team Number"
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
        name="teamName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Team Name"
                {...field}
                autoComplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="qualificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qualification Number</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Qualification Number"
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
        name="allianceColour"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alliance Colour</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Alliance Colour" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
