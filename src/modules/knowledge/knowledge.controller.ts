import { Request, Response } from "express";
import multer from "multer";
import {
  addTextChunk,
  processPDF,
  getAllChunks,
  deleteChunk,
  clearAllChunks,
} from "./knowledge.service";

// Multer memory storage (file buffer-এ রাখো)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// POST /knowledge/text — Text যোগ করো
const addText = async (req: Request, res: Response) => {
  try {
    const { topic, content } = req.body;

    if (!topic || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Topic and content are required" });
    }

    const chunks = await addTextChunk(topic, content);

    return res.status(201).json({
      success: true,
      message: `${chunks.length} chunk(s) added and embedded successfully`,
      count: chunks.length,
    });
  } catch (error) {
    console.error("Add text error:", error);
    return res.status(500).json({ success: false, message: "Failed to add text" });
  }
};

// POST /knowledge/pdf — PDF upload করো
const addPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "PDF file is required" });
    }

    const topic = req.body.topic || "PDF Document";
    const chunks = await processPDF(req.file.buffer, topic);

    return res.status(201).json({
      success: true,
      message: `PDF processed: ${chunks.length} chunk(s) embedded`,
      count: chunks.length,
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to process PDF" });
  }
};

// GET /knowledge — সব chunks দেখো
const getAll = async (_req: Request, res: Response) => {
  try {
    const chunks = await getAllChunks();
    return res.json({ success: true, data: chunks, total: chunks.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

// DELETE /knowledge/:id — একটা chunk delete করো
const deleteOne = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteChunk(id);
    return res.json({ success: true, message: "Chunk deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// DELETE /knowledge/clear — সব clear করো
const clearAll = async (_req: Request, res: Response) => {
  try {
    await clearAllChunks();
    return res.json({ success: true, message: "All knowledge cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to clear" });
  }
};

export const KnowledgeController = { addText, addPDF, getAll, deleteOne, clearAll };
