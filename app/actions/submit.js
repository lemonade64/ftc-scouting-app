"use server";

import { google } from "googleapis";

export async function submit(formData) {
  const spreadsheetID = formData.get("spreadsheetID");
  const sheetID = formData.get("sheetID");
  if (!spreadsheetID || !sheetID) {
    throw new Error("Spreadsheet Details are Missing");
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values = [
      formData.get("teamNumber"),
      formData.get("teamName"),
      formData.get("qualificationNumber"),
      formData.get("allianceColour"),
      formData.get("autoPreload"),
      formData.get("autoAscentLevel"),
      formData.get("autoBasketHigh"),
      formData.get("autoBasketLow"),
      formData.get("autoChamberHigh"),
      formData.get("autoChamberLow"),
      formData.get("teleopBasketHigh"),
      formData.get("teleopBasketLow"),
      formData.get("teleopChamberHigh"),
      formData.get("teleopChamberLow"),
      formData.get("teleopCycleTimes"),
      formData.get("endgameAscentLevel"),
      formData.get("endgameAscentTime"),
      formData.get("extraNotes"),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetID,
      range: sheetID,
      valueInputOption: "RAW",
      requestBody: {
        values: [values],
      },
    });

    return { success: true, message: "Data Submitted Successfully" };
  } catch (error) {
    console.error("Error Submitting Form:", error);
    if (error.errors) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { success: false, message: `Validation Failed: ${errorMessages}` };
    }
    return { success: false, message: "Failed To Submit Data" };
  }
}
