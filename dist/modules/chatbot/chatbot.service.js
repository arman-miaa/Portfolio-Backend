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
exports.getActiveAiConfig = getActiveAiConfig;
exports.initPgVector = initPgVector;
exports.generateEmbedding = generateEmbedding;
exports.searchSimilarChunks = searchSimilarChunks;
exports.generateAIResponse = generateAIResponse;
exports.ragChat = ragChat;
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../../config/db");
const aiSetting_service_1 = require("../aiSetting/aiSetting.service");
// ✅ Retrieve current active AI configuration (DB key has priority, then .env)
function getActiveAiConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const setting = yield db_1.prisma.aiSetting.findFirst({
                where: { isActive: true },
                orderBy: { updatedAt: "desc" },
            });
            if (setting && ((_a = setting.value) === null || _a === void 0 ? void 0 : _a.trim())) {
                const provider = setting.provider || (0, aiSetting_service_1.detectProviderFromKey)(setting.value);
                return {
                    apiKey: setting.value.trim(),
                    provider,
                    modelName: ((_b = setting.model) === null || _b === void 0 ? void 0 : _b.trim()) || (0, aiSetting_service_1.getDefaultModelForProvider)(provider),
                    baseUrl: ((_c = setting.baseUrl) === null || _c === void 0 ? void 0 : _c.trim()) || "",
                    title: setting.title || `${provider.toUpperCase()} Key`,
                    source: "database",
                };
            }
        }
        catch (err) {
            console.warn("Could not read ai_settings from DB:", err);
        }
        const envKey = (_d = process.env.GEMINI_API_KEY) === null || _d === void 0 ? void 0 : _d.trim();
        if (envKey) {
            return {
                apiKey: envKey,
                provider: "gemini",
                modelName: "gemini-3.5-flash-lite",
                baseUrl: "",
                title: "Environment Default (.env)",
                source: "env",
            };
        }
        return {
            apiKey: "",
            provider: "gemini",
            modelName: "gemini-3.5-flash-lite",
            baseUrl: "",
            title: "",
            source: "none",
        };
    });
}
// ✅ pgvector extension + tables initialize
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
            // Ensure ai_settings table exists
            yield db_1.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ai_settings (
        id SERIAL PRIMARY KEY,
        "key" VARCHAR(255) UNIQUE NOT NULL DEFAULT 'CHATBOT_AI_KEY',
        "title" VARCHAR(255),
        "provider" VARCHAR(50) DEFAULT 'gemini',
        "value" TEXT NOT NULL,
        "model" VARCHAR(255) DEFAULT 'gemini-3.5-flash-lite',
        "baseUrl" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log("✅ pgvector and ai_settings initialized");
        }
        catch (error) {
            console.error("pgvector init error (may already exist):", error);
        }
    });
}
// ✅ Helper to get a working Gemini API key specifically for embeddings (DB key if gemini, else .env)
function getGeminiEmbeddingKey() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const active = yield getActiveAiConfig();
        if (active.provider === "gemini" && active.apiKey) {
            return active.apiKey;
        }
        const envKey = (_a = process.env.GEMINI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
        if (envKey)
            return envKey;
        return active.apiKey;
    });
}
// ✅ Gemini embedding generate with model fallback
function generateEmbedding(text, customKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = (customKey === null || customKey === void 0 ? void 0 : customKey.trim()) || (yield getGeminiEmbeddingKey());
        if (!apiKey) {
            throw new Error("No Gemini API key available for embedding generation");
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const embeddingModels = ["gemini-embedding-2", "gemini-embedding-001"];
        let lastError = null;
        for (const modelName of embeddingModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = yield model.embedContent({
                    content: { role: "user", parts: [{ text }] },
                    outputDimensionality: 768,
                });
                if ((_a = result === null || result === void 0 ? void 0 : result.embedding) === null || _a === void 0 ? void 0 : _a.values) {
                    return result.embedding.values;
                }
            }
            catch (err) {
                console.warn(`Embedding model ${modelName} failed:`, err);
                lastError = err;
            }
        }
        throw lastError || new Error("Failed to generate embedding");
    });
}
// ✅ pgvector দিয়ে similar chunks খোঁজো
function searchSimilarChunks(embedding_1) {
    return __awaiter(this, arguments, void 0, function* (embedding, limit = 5) {
        try {
            const vectorStr = `[${embedding.join(",")}]`;
            const results = yield db_1.prisma.$queryRawUnsafe(`SELECT id, topic, content,
        1 - (embedding <=> $1::vector) as similarity
       FROM knowledge_chunks
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`, vectorStr, limit);
            return results || [];
        }
        catch (error) {
            console.warn("searchSimilarChunks query error:", error);
            return [];
        }
    });
}
// ✅ OpenAI-compatible chat completion generator (OpenRouter, Groq, OpenAI, Custom)
function generateOpenAICompatibleResponse(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const { endpoint, apiKey, model, provider, systemPrompt, userMessage } = params;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
        };
        if (provider === "openrouter") {
            headers["HTTP-Referer"] = "https://arman-mia.vercel.app";
            headers["X-Title"] = "Arman Mia Portfolio Chatbot";
        }
        const response = yield fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({
                model: model.trim(),
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 800,
            }),
        });
        const data = yield response.json().catch(() => null);
        if (!response.ok || (data === null || data === void 0 ? void 0 : data.error)) {
            const errorMsg = ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) ||
                (data === null || data === void 0 ? void 0 : data.message) ||
                `Provider returned status ${response.status}`;
            throw new Error(`${provider.toUpperCase()} error: ${errorMsg}`);
        }
        const content = (_d = (_c = (_b = data.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
        if (!content) {
            throw new Error(`Empty response from ${provider.toUpperCase()}`);
        }
        return content;
    });
}
// ✅ Gemini AI response generator with automatic fallback
function generateGeminiResponse(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { apiKey, preferredModel, systemPrompt, userMessage } = params;
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const candidateModels = Array.from(new Set([
            preferredModel,
            "gemini-3.5-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-3.1-flash-lite",
            "gemini-3.8-flash",
        ].filter(Boolean)));
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}\n\nAnswer:`;
        let lastError = null;
        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = yield model.generateContent(fullPrompt);
                const text = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.text();
                if (text) {
                    return text;
                }
            }
            catch (error) {
                console.warn(`Gemini model ${modelName} error:`, (error === null || error === void 0 ? void 0 : error.message) || error);
                lastError = error;
            }
        }
        throw (lastError ||
            new Error("AI is temporarily unavailable across all Gemini candidate models."));
    });
}
// ✅ Universal AI response generator based on active provider
function generateAIResponse(context, question) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield getActiveAiConfig();
        if (!config.apiKey) {
            throw new Error("No AI API Key configured. Please add an API key in Admin Dashboard > AI Settings.");
        }
        const systemPrompt = `You are the official AI assistant for Arman Mia's developer portfolio website.
Your mission is to answer visitor questions about Arman Mia in a modern, engaging, and professional style.

Formatting & Style Rules:
- Use **bold** formatting for important highlights like job titles, company names, key technologies, and achievements.
- Use tasteful, modern emojis (💻, 🚀, 🛠️, 💼, ⚡, 🌟, 📧, 📍) to make responses lively, modern, and easy to read.
- Use clean bullet points (• or -) when listing skills, projects, or responsibilities.
- Respond in the same language the visitor asks in (English, Bengali, etc.).
- Be concise, friendly, confident, and accurate. If asked an off-topic question, politely redirect to Arman's work.

Verified Details About Arman Mia:
• Current Position: On-site **Full-Stack Developer at S.M Technology** (Feb 2025 – Present), where he develops and maintains scalable web applications, handling authentication systems, real-time features, cloud deployment, and payment gateway integrations.
• Previous Position: Remote **Frontend Developer Intern at Advisor Media Group** (Jul 2025 – Sept 2025), focusing on responsive frontend development, UI/UX collaboration, and API integration.
• Tech Stack:
  - Frontend: React.js, Next.js, TypeScript, Tailwind CSS, Redux
  - Backend: Node.js, Express.js, PostgreSQL, Prisma, MongoDB, Firebase
  - Cloud & Tools: Git, GitHub, Linux, Docker, AWS, VPS, Nginx, Postman
• Contact: arman.miaa36@gmail.com | +880 1736550601 | Bhairav, Dhaka, Bangladesh

Additional Context:
${context}`;
        if (config.provider === "gemini") {
            return yield generateGeminiResponse({
                apiKey: config.apiKey,
                preferredModel: config.modelName,
                systemPrompt,
                userMessage: question,
            });
        }
        const endpoint = (0, aiSetting_service_1.getProviderEndpoint)(config.provider, config.baseUrl);
        return yield generateOpenAICompatibleResponse({
            endpoint,
            apiKey: config.apiKey,
            model: config.modelName,
            provider: config.provider,
            systemPrompt,
            userMessage: question,
        });
    });
}
// ✅ Main RAG chat function with robust context retrieval
function ragChat(userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let context = "Arman Mia currently works as an on-site Full-Stack Developer at S.M Technology (Feb 2025 – Present), where he develops and maintains scalable web applications, handling authentication systems, real-time features, cloud deployment, and payment gateway integrations. Previously, he completed a remote Frontend Developer Intern position at Advisor Media Group (Jul 2025 – Sept 2025), focusing on responsive frontend development, UI/UX collaboration, and API integration. He specializes in MERN stack, Next.js, PostgreSQL, and Prisma.";
        let chunksFound = false;
        // 1. Try vector similarity search
        try {
            const queryEmbedding = yield generateEmbedding(userMessage);
            const chunks = yield searchSimilarChunks(queryEmbedding, 5);
            if (chunks && chunks.length > 0) {
                context = chunks.map((c) => `[${c.topic}]: ${c.content}`).join("\n\n");
                chunksFound = true;
            }
        }
        catch (vectorError) {
            console.warn("Vector similarity retrieval skipped/failed:", vectorError);
        }
        // 2. Fallback to direct DB knowledge chunks if vector search didn't find chunks
        if (!chunksFound) {
            try {
                const allChunks = yield db_1.prisma.knowledgeChunk.findMany({
                    take: 6,
                    orderBy: { updatedAt: "desc" },
                    select: { topic: true, content: true },
                });
                if (allChunks.length > 0) {
                    context = allChunks.map((c) => `[${c.topic}]: ${c.content}`).join("\n\n");
                }
            }
            catch (dbError) {
                console.warn("Direct knowledge chunks retrieval fallback:", dbError);
            }
        }
        // 3. Generate completion with configured AI provider
        try {
            return yield generateAIResponse(context, userMessage);
        }
        catch (error) {
            console.error("RAG chat completion error:", error);
            throw error;
        }
    });
}
