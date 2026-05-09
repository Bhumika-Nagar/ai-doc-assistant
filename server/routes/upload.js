import express from "express";
import multer from "multer";
import path from "path";
import { extractText } from "../utils/extractText.js";
import Document from "../models/Document.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".txt" || ext === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only .txt and .pdf files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase().replace(".", "");
    const filePath = req.file.path;

    const content = await extractText(filePath, ext);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from file. File may be empty or scanned." });
    }


    const doc = await Document.create({
      filename: req.file.originalname,
      storedName: req.file.filename,
      fileType: ext,
      size: req.file.size,
      content,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      document: {
        _id: doc._id,
        filename: doc.filename,
        fileType: doc.fileType,
        size: doc.size,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const docs = await Document.find({}, "-content")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
