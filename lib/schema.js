import * as z from "zod";

export const formSchema = z.object({
  teamNumber: z.number().int().positive(),
  teamName: z.string().optional(),
  qualificationNumber: z.number().int().positive(),
  allianceColour: z.enum(["Red", "Blue"]),
  autoPreload: z.enum(["Specimen", "Sample", "Nothing"]),
  autoBasketHigh: z.number().int().nonnegative(),
  autoBasketLow: z.number().int().nonnegative(),
  autoChamberHigh: z.number().int().nonnegative(),
  autoChamberLow: z.number().int().nonnegative(),
  teleopBasketHigh: z.number().int().nonnegative(),
  teleopBasketLow: z.number().int().nonnegative(),
  teleopChamberHigh: z.number().int().nonnegative(),
  teleopChamberLow: z.number().int().nonnegative(),
  teleopCycleTimes: z
    .array(z.number())
    .min(1, "At least one cycle time is required"),
  endgameAscentLevel: z.enum(["High", "Low", "Park", "Nothing"]),
  endgameAscentTime: z.number().nonnegative(),
  extraNotes: z.string().optional(),
});
