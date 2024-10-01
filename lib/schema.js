import * as z from "zod";

export const formSchema = z.object({
  teamNumber: z.number().int().positive({ message: "Team Number is Required" }),
  teamName: z.string().optional(),
  qualificationNumber: z
    .number()
    .int()
    .positive({ message: "Qualification Number is Required" }),
  allianceColour: z.enum(["Red", "Blue"], {
    required_error: "Alliance Colour is Required",
  }),
  autoPreload: z.enum(["Specimen", "Sample", "Nothing"], {
    required_error: "Preload Selection is Required",
  }),
  autoBasketHigh: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  autoBasketLow: z
    .number()
    .int()
    .nonnegative({ message: "Must be a Non-Negative Integer" }),
  autoChamberHigh: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  autoChamberLow: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopBasketHigh: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopBasketLow: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopChamberHigh: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopChamberLow: z.number().int().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  teleopCycleTimes: z
    .array(z.number())
    .min(1, "At Least 1 Cycle Time is Required"),
  endgameAscentLevel: z.enum(["High", "Low", "Park", "Nothing"], {
    required_error: "Ascent Level is Required",
  }),
  endgameAscentTime: z.number().nonnegative({
    message: "Must be a Non-Negative Integer",
  }),
  extraNotes: z.string().optional(),
});
