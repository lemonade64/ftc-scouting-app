"use server";

import { z } from "zod";
import { formSchema } from "@/lib/schema";

export async function submitForm(formData) {
  try {
    const validatedData = formSchema.parse(formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form Data Submitted:", validatedData);

    return { success: "Form Submitted Successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: "Unexpected Error Iccurred" };
  }
}
