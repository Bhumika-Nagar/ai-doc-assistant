import mongoose from "mongoose";

// Stores each Q&A exchange tied to a document
const ChatHistorySchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ChatHistory", ChatHistorySchema);
