import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import uploadRoute from "./routes/upload.js";
import summarizeRoute from "./routes/summarize.js";
import askRoute from "./routes/ask.js";
import historyRoute from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files


app.use("/upload", uploadRoute);
app.use("/summarize", summarizeRoute);
app.use("/ask", askRoute);
app.use("/history", historyRoute);


app.get("/", (req, res) => {
  res.json({ status: "AI Document Assistant API running" });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
