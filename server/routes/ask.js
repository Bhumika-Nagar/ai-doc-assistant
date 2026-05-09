import express from "express";
import Document from "../models/Document.js";
import ChatHistory from "../models/ChatHistory.js";
import { answerQuestion } from "../utils/aiUtils.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: "documentId and question are required" });
    }

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const answer = await answerQuestion(question, doc.content);

    await ChatHistory.create({ documentId, question, answer });

    res.json({ question, answer });
  } catch (err) {
    console.error("Ask error:", err.message);
    res.status(500).json({ error: "Failed to answer question: " + err.message });
  }
});

export default router;
