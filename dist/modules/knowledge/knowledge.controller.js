"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeController = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const knowledge_service_1 = require("./knowledge.service");
// Multer memory storage (file buffer-এ রাখো)
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});
// POST /knowledge/text — Text যোগ করো
const addText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, content } = req.body;
        if (!topic || !content) {
            return res
                .status(400)
                .json({ success: false, message: "Topic and content are required" });
        }
        const chunks = yield (0, knowledge_service_1.addTextChunk)(topic, content);
        return res.status(201).json({
            success: true,
            message: `${chunks.length} chunk(s) added and embedded successfully`,
            count: chunks.length,
        });
    }
    catch (error) {
        console.error("Add text error:", error);
        return res.status(500).json({ success: false, message: "Failed to add text" });
    }
});
// POST /knowledge/pdf — PDF upload করো
const addPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "PDF file is required" });
        }
        const topic = req.body.topic || "PDF Document";
        const chunks = yield (0, knowledge_service_1.processPDF)(req.file.buffer, topic);
        return res.status(201).json({
            success: true,
            message: `PDF processed: ${chunks.length} chunk(s) embedded`,
            count: chunks.length,
        });
    }
    catch (error) {
        console.error("PDF upload error:", error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Failed to process PDF" });
    }
});
// GET /knowledge — সব chunks দেখো
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chunks = yield (0, knowledge_service_1.getAllChunks)();
        return res.json({ success: true, data: chunks, total: chunks.length });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch" });
    }
});
// DELETE /knowledge/:id — একটা chunk delete করো
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, knowledge_service_1.deleteChunk)(id);
        return res.json({ success: true, message: "Chunk deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete" });
    }
});
// DELETE /knowledge/clear — সব clear করো
const clearAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, knowledge_service_1.clearAllChunks)();
        return res.json({ success: true, message: "All knowledge cleared" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to clear" });
    }
});
exports.KnowledgeController = { addText, addPDF, getAll, deleteOne, clearAll };
