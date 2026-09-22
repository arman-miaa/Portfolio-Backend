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
exports.addTextChunk = addTextChunk;
exports.processPDF = processPDF;
exports.getAllChunks = getAllChunks;
exports.deleteChunk = deleteChunk;
exports.clearAllChunks = clearAllChunks;
const db_1 = require("../../config/db");
const chatbot_service_1 = require("../chatbot/chatbot.service");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
// ✅ Text chunk করো (500 chars, 50 overlap)
function chunkText(text, size = 500, overlap = 50) {
    const chunks = [];
    let start = 0;
    const cleanText = text.replace(/\s+/g, " ").trim();
    while (start < cleanText.length) {
        const end = Math.min(start + size, cleanText.length);
        const chunk = cleanText.slice(start, end).trim();
        if (chunk.length > 50)
            chunks.push(chunk); // Too small chunks skip
        start += size - overlap;
    }
    return chunks;
}
// ✅ Text chunk add + embed করো
function addTextChunk(topic, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = chunkText(content);
        const saved = [];
        for (const chunk of chunks) {
            // DB-তে save করো
            const record = yield db_1.prisma.knowledgeChunk.create({
                data: { topic, content: chunk },
            });
            // Embedding generate করো
            const embedding = yield (0, chatbot_service_1.generateEmbedding)(chunk);
            const vectorStr = `[${embedding.join(",")}]`;
            // Vector column update করো (raw SQL)
            yield db_1.prisma.$executeRawUnsafe(`UPDATE knowledge_chunks SET embedding = '${vectorStr}'::vector WHERE id = $1`, record.id);
            saved.push(record);
        }
        return saved;
    });
}
// ✅ PDF parse করে text extract + chunk করো
function processPDF(buffer, topic) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsed = yield (0, pdf_parse_1.default)(buffer);
        const text = parsed.text;
        if (!text || text.trim().length < 10) {
            throw new Error("PDF text extraction failed or PDF is empty");
        }
        return yield addTextChunk(topic, text);
    });
}
// ✅ সব knowledge chunks দেখো
function getAllChunks() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.prisma.knowledgeChunk.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                topic: true,
                content: true,
                createdAt: true,
            },
        });
    });
}
// ✅ একটা chunk delete করো
function deleteChunk(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.prisma.knowledgeChunk.delete({ where: { id } });
    });
}
// ✅ সব chunks clear করো
function clearAllChunks() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.prisma.knowledgeChunk.deleteMany({});
    });
}
