import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../config/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ pgvector extension + column initialize
export async function initPgVector() {
  try {
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`;
    await prisma.$executeRaw`
      ALTER TABLE knowledge_chunks
      ADD COLUMN IF NOT EXISTS embedding vector(768)
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
      ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 10)
    `;
    console.log("✅ pgvector initialized");
  } catch (error) {
    console.error("pgvector init error (may already exist):", error);
  }
}

// ✅ Gemini embedding generate করো
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// ✅ pgvector দিয়ে similar chunks খোঁজো
export async function searchSimilarChunks(
  embedding: number[],
  limit = 5
): Promise<Array<{ id: number; topic: string; content: string; similarity: number }>> {
  const vectorStr = `[${embedding.join(",")}]`;
  const results: any[] = await prisma.$queryRawUnsafe(
    `SELECT id, topic, content,
      1 - (embedding <=> '${vectorStr}'::vector) as similarity
     FROM knowledge_chunks
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> '${vectorStr}'::vector
     LIMIT $1`,
    limit
  );
  return results;
}

// ✅ Gemini দিয়ে AI response generate করো
export async function generateAIResponse(
  context: string,
  question: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a helpful AI assistant for Arman Mia's portfolio website. 
Your job is to answer questions about Arman Mia based on the context provided.
Be friendly, concise, and professional. Answer in the same language the user asks in.
If the question is not related to Arman or his work, politely redirect.

Context about Arman Mia:
${context}

User Question: ${question}

Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ✅ Main RAG chat function
export async function ragChat(userMessage: string): Promise<string> {
  try {
    // 1. User message embed করো
    const queryEmbedding = await generateEmbedding(userMessage);

    // 2. Similar chunks খোঁজো
    const chunks = await searchSimilarChunks(queryEmbedding, 5);

    if (chunks.length === 0) {
      // No knowledge base yet — fallback
      return await generateAIResponse(
        "Arman Mia is a Full-Stack Developer specializing in MERN stack, Next.js, PostgreSQL and Prisma.",
        userMessage
      );
    }

    // 3. Context তৈরি করো
    const context = chunks
      .map((c) => `[${c.topic}]: ${c.content}`)
      .join("\n\n");

    // 4. AI response generate করো
    return await generateAIResponse(context, userMessage);
  } catch (error) {
    console.error("RAG chat error:", error);
    throw new Error("AI response generation failed");
  }
}
