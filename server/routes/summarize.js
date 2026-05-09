import express from "express";
import Document from "../models/Document.js";
import { summarizeDocument } from "../utils/aiUtils.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: "documentId is required" });

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.summary && doc.summary.length > 0) {
      return res.json({ summary: doc.summary, cached: true });
    }

    const summary = await summarizeDocument(doc.content);

    doc.summary = summary;
    await doc.save();

    res.json({ summary, cached: false });
  } catch (err) {
    console.error("Summarize error:", err.message);
    res.status(500).json({ error: "Failed to generate summary: " + err.message });
  }
});

export default router;
