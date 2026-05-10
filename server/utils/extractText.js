import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractText(filePath, fileType) {
  if (fileType === "txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (fileType === "pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  throw new Error("Unsupported file type. Only .txt and .pdf are supported.");
}
