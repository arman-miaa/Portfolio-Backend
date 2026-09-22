import { prisma } from "../../config/db";
import { generateEmbedding } from "../chatbot/chatbot.service";
import pdfParse from "pdf-parse";

// ✅ Text chunk করো (500 chars, 50 overlap)
function chunkText(text: string, size = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  const cleanText = text.replace(/\s+/g, " ").trim();

  while (start < cleanText.length) {
    const end = Math.min(start + size, cleanText.length);
    const chunk = cleanText.slice(start, end).trim();
    if (chunk.length > 50) chunks.push(chunk); // Too small chunks skip
    start += size - overlap;
  }
  return chunks;
}

// ✅ Text chunk add + embed করো
export async function addTextChunk(topic: string, content: string) {
  const chunks = chunkText(content);
  const saved = [];

  for (const chunk of chunks) {
    // DB-তে save করো
    const record = await prisma.knowledgeChunk.create({
      data: { topic, content: chunk },
    });

    // Embedding generate করো
    const embedding = await generateEmbedding(chunk);
    const vectorStr = `[${embedding.join(",")}]`;

    // Vector column update করো (raw SQL)
    await prisma.$executeRawUnsafe(
      `UPDATE knowledge_chunks SET embedding = '${vectorStr}'::vector WHERE id = $1`,
      record.id
    );

    saved.push(record);
  }

  return saved;
}

// ✅ PDF parse করে text extract + chunk করো
export async function processPDF(
  buffer: Buffer,
  topic: string
) {
  const parsed = await pdfParse(buffer);
  const text = parsed.text;

  if (!text || text.trim().length < 10) {
    throw new Error("PDF text extraction failed or PDF is empty");
  }

  return await addTextChunk(topic, text);
}

// ✅ সব knowledge chunks দেখো
export async function getAllChunks() {
  return await prisma.knowledgeChunk.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      topic: true,
      content: true,
      createdAt: true,
    },
  });
}

// ✅ একটা chunk delete করো
export async function deleteChunk(id: number) {
  return await prisma.knowledgeChunk.delete({ where: { id } });
}

// ✅ সব chunks clear করো
export async function clearAllChunks() {
  return await prisma.knowledgeChunk.deleteMany({});
}
