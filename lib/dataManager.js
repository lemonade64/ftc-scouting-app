import { z } from "zod";
import { formSchema } from "@/lib/schema";

const submissionsArraySchema = z.array(formSchema);

export function loadData() {
  const savedData = localStorage.getItem("formSubmissions");
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      return submissionsArraySchema.parse(parsedData);
    } catch (error) {
      console.error("Error Loading Data:", error);
      return [];
    }
  }
  return [];
}

export function saveData(newData) {
  const existingData = loadData();
  const updatedData = [...existingData, ...newData];
  localStorage.setItem("formSubmissions", JSON.stringify(updatedData));
}

export function updateData(updatedData) {
  localStorage.setItem("formSubmissions", JSON.stringify(updatedData));
}

export function clearData() {
  localStorage.removeItem("formSubmissions");
}
