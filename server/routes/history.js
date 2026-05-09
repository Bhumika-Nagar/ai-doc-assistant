import express from "express";
import ChatHistory from "../models/ChatHistory.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { documentId } = req.query;
    if (!documentId) return res.status(400).json({ error: "documentId query param is required" });

    const history = await ChatHistory.find({ documentId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
