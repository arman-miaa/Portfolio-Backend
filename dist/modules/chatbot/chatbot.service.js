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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPgVector = initPgVector;
exports.generateEmbedding = generateEmbedding;
exports.searchSimilarChunks = searchSimilarChunks;
exports.generateAIResponse = generateAIResponse;
exports.ragChat = ragChat;
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../../config/db");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// ✅ pgvector extension + column initialize
function initPgVector() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.prisma.$executeRaw `CREATE EXTENSION IF NOT EXISTS vector`;
            yield db_1.prisma.$executeRaw `
      ALTER TABLE knowledge_chunks
      ADD COLUMN IF NOT EXISTS embedding vector(768)
    `;
            yield db_1.prisma.$executeRaw `
      CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
      ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 10)
    `;
            console.log("✅ pgvector initialized");
        }
        catch (error) {
            console.error("pgvector init error (may already exist):", error);
        }
    });
}
// ✅ Gemini embedding generate করো
function generateEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
        const result = yield model.embedContent({
            content: { role: "user", parts: [{ text }] },
            outputDimensionality: 768
        });
        return result.embedding.values;
    });
}
// ✅ pgvector দিয়ে similar chunks খোঁজো
function searchSimilarChunks(embedding_1) {
    return __awaiter(this, arguments, void 0, function* (embedding, limit = 5) {
        const vectorStr = `[${embedding.join(",")}]`;
        const results = yield db_1.prisma.$queryRawUnsafe(`SELECT id, topic, content,
      1 - (embedding <=> '${vectorStr}'::vector) as similarity
     FROM knowledge_chunks
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> '${vectorStr}'::vector
     LIMIT $1`, limit);
        return results;
    });
}
// ✅ Gemini দিয়ে AI response generate করো
function generateAIResponse(context, question) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const prompt = `You are a helpful AI assistant for Arman Mia's portfolio website. 
Your job is to answer questions about Arman Mia based on the context provided.
Be friendly, concise, and professional. Answer in the same language the user asks in.
If the question is not related to Arman or his work, politely redirect.

Context about Arman Mia:
${context}

User Question: ${question}

Answer:`;
        const result = yield model.generateContent(prompt);
        return result.response.text();
    });
}
// ✅ Main RAG chat function
function ragChat(userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. User message embed করো
            const queryEmbedding = yield generateEmbedding(userMessage);
            // 2. Similar chunks খোঁজো
            const chunks = yield searchSimilarChunks(queryEmbedding, 5);
            if (chunks.length === 0) {
                // No knowledge base yet — fallback
                return yield generateAIResponse("Arman Mia is a Full-Stack Developer specializing in MERN stack, Next.js, PostgreSQL and Prisma.", userMessage);
            }
            // 3. Context তৈরি করো
            const context = chunks
                .map((c) => `[${c.topic}]: ${c.content}`)
                .join("\n\n");
            // 4. AI response generate করো
            return yield generateAIResponse(context, userMessage);
        }
        catch (error) {
            console.error("RAG chat error:", error);
            throw error;
        }
    });
}
