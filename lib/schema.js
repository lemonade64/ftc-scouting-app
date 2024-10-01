import * as z from "zod";

export const formSchema = z.object({
  teamNumber: z.coerce
    .number()
    .int()
    .positive({ message: "Team Number is Required" }),
  teamName: z.string().optional(),
  qualificationNumber: z.coerce
    .number()
    .int()
    .positive({ message: "Qualification Number is Required" }),
  allianceColour: z.enum(["Red", "Blue"], {
    required_error: "Alliance Colour is Required",
  }),
  autoPreload: z.enum(["Specimen", "Sample", "Nothing"], {
    required_error: "Preload Selection is Required",
  }),
  autoBasketHigh: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  autoBasketLow: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Must be a Non-Negative Integer" }),
  autoChamberHigh: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  autoChamberLow: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopBasketHigh: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopBasketLow: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopChamberHigh: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopChamberLow: z.coerce.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopCycleTimes: z
    .array(z.number())
    .min(1, "At Least 1 Cycle Time is Required"),
  endgameAscentLevel: z.enum(["High", "Low", "Park", "Nothing"], {
    required_error: "Ascent Level is Required",
  }),
  endgameAscentTime: z.coerce.number().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  extraNotes: z.string().optional(),
});
