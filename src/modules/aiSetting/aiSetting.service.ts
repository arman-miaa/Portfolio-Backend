import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../config/db";

export type AiProvider = "openrouter" | "gemini" | "groq" | "openai" | "deepseek" | "custom";

export function maskKey(key: string): string {
  if (!key) return "";
  const trimmed = key.trim();
  if (trimmed.length <= 8) return "••••••••";
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}

export function detectProviderFromKey(key: string): AiProvider {
  const trimmed = key.trim();
  if (trimmed.startsWith("sk-or-v1-") || trimmed.startsWith("sk-or-")) {
    return "openrouter";
  }
  if (trimmed.startsWith("AIzaSy")) {
    return "gemini";
  }
  if (trimmed.startsWith("gsk_")) {
    return "groq";
  }
  if (trimmed.startsWith("sk-proj-") || (trimmed.startsWith("sk-") && !trimmed.startsWith("sk-or-"))) {
    return "openai";
  }
  return "openrouter";
}

export function getProviderEndpoint(provider: string, customBaseUrl?: string): string {
  if (customBaseUrl && customBaseUrl.trim()) {
    const clean = customBaseUrl.trim().replace(/\/+$/, "");
    return clean.endsWith("/chat/completions") ? clean : `${clean}/chat/completions`;
  }
  switch ((provider || "").toLowerCase()) {
    case "groq":
      return "https://api.groq.com/openai/v1/chat/completions";
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "deepseek":
      return "https://api.deepseek.com/chat/completions";
    case "openrouter":
    default:
      return "https://openrouter.ai/api/v1/chat/completions";
  }
}

export function getDefaultModelForProvider(provider: string): string {
  switch ((provider || "").toLowerCase()) {
    case "openrouter":
      return "google/gemini-2.0-flash-exp:free";
    case "groq":
      return "llama-3.3-70b-versatile";
    case "openai":
      return "gpt-4o-mini";
    case "deepseek":
      return "deepseek-chat";
    case "gemini":
    default:
      return "gemini-3.5-flash-lite";
  }
}

// ── Real API Model Fetcher ─────────────────────────────────────────────
export async function fetchRealModelsFromProvider(
  provider: string,
  apiKey?: string
): Promise<Array<{ id: string; name: string }>> {
  const cleanProvider = (provider || "openrouter").toLowerCase();

  try {
    if (cleanProvider === "openrouter") {
      // OpenRouter models are public, optional key
      const headers: Record<string, string> = {};
      if (apiKey?.trim()) {
        headers["Authorization"] = `Bearer ${apiKey.trim()}`;
      }
      const r = await fetch("https://openrouter.ai/api/v1/models", { headers });
      const data = await r.json();
      const rawList = data.data || [];

      // Sort free models first, then popular providers
      const models = rawList.map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        isFree: m.id.includes(":free"),
      }));

      models.sort((a: any, b: any) => {
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return a.name.localeCompare(b.name);
      });

      return models.map((m: any) => ({ id: m.id, name: m.name }));
    }

    if (cleanProvider === "gemini") {
      let keyToUse = apiKey?.trim();
      if (!keyToUse) {
        keyToUse = process.env.GEMINI_API_KEY?.trim();
      }
      if (!keyToUse) {
        throw new Error("Gemini API key is required to load models");
      }

      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${keyToUse}`
      );
      const data = await r.json();
      if (!r.ok || data.error) {
        throw new Error(data.error?.message || "Failed to load Gemini models");
      }

      const models = (data.models || [])
        .filter((m: any) =>
          m.supportedGenerationMethods?.includes("generateContent")
        )
        .map((m: any) => ({
          id: m.name.replace(/^models\//, ""),
          name: m.displayName || m.name.replace(/^models\//, ""),
        }));

      return models;
    }

    if (cleanProvider === "groq") {
      if (!apiKey?.trim()) throw new Error("Groq API key required to load models");
      const r = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await r.json();
      if (!r.ok || data.error) {
        throw new Error(data.error?.message || "Failed to load Groq models");
      }
      return (data.data || []).map((m: any) => ({ id: m.id, name: m.id }));
    }

    if (cleanProvider === "openai") {
      if (!apiKey?.trim()) throw new Error("OpenAI API key required to load models");
      const r = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await r.json();
      if (!r.ok || data.error) {
        throw new Error(data.error?.message || "Failed to load OpenAI models");
      }
      return (data.data || [])
        .filter(
          (m: any) =>
            m.id.startsWith("gpt-") || m.id.startsWith("o1") || m.id.startsWith("o3")
        )
        .sort((a: any, b: any) => a.id.localeCompare(b.id))
        .map((m: any) => ({ id: m.id, name: m.id }));
    }

    if (cleanProvider === "deepseek") {
      if (!apiKey?.trim()) throw new Error("DeepSeek API key required to load models");
      const r = await fetch("https://api.deepseek.com/models", {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      const data = await r.json();
      if (!r.ok || data.error) {
        throw new Error(data.error?.message || "Failed to load DeepSeek models");
      }
      return (data.data || []).map((m: any) => ({ id: m.id, name: m.id }));
    }

    return [];
  } catch (err: any) {
    console.warn(`Error fetching models for ${provider}:`, err.message);
    throw err;
  }
}

// ── Get all configured keys ───────────────────────────────────────────
export async function getAllAiConfigs() {
  const configs = await prisma.aiSetting.findMany({
    orderBy: { createdAt: "desc" },
  });

  const envKey = process.env.GEMINI_API_KEY?.trim() || "";
  const hasEnvFallback = Boolean(envKey);

  const activeConfig = configs.find((c) => c.isActive) || configs[0] || null;

  const formatted = configs.map((c) => ({
    id: c.id,
    name: c.title || `${(c.provider || "AI").toUpperCase()} Key`,
    providerType: c.provider || detectProviderFromKey(c.value),
    apiKey: maskKey(c.value),
    rawKeyPreview: c.value ? `${c.value.substring(0, 8)}...${c.value.slice(-4)}` : "",
    model: c.model || "",
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return {
    apiConfigs: formatted,
    activeApiConfigId: activeConfig ? String(activeConfig.id) : "",
    activeConfig: activeConfig
      ? {
          id: activeConfig.id,
          name: activeConfig.title || "Active Key",
          providerType: activeConfig.provider || "gemini",
          model: activeConfig.model,
          maskedKey: maskKey(activeConfig.value),
        }
      : null,
    hasEnvFallback,
  };
}

// ── Save or Update API Key config ─────────────────────────────────────
export async function saveAiConfig(data: {
  id?: number | string;
  name?: string;
  providerType: string;
  apiKey: string;
  model: string;
}) {
  const trimmedKey = data.apiKey?.trim();
  if (!trimmedKey) {
    throw new Error("API Key cannot be empty");
  }

  const provider = (data.providerType || detectProviderFromKey(trimmedKey)).toLowerCase();
  const name = data.name?.trim() || `${provider.toUpperCase()} Key`;
  const model = data.model?.trim() || "default";

  // If editing an existing config
  if (data.id && !isNaN(Number(data.id))) {
    const existing = await prisma.aiSetting.findUnique({
      where: { id: Number(data.id) },
    });

    if (existing) {
      // If updating with masked key or empty, keep existing key
      const keyToSave = trimmedKey.includes("...") || trimmedKey.includes("•••")
        ? existing.value
        : trimmedKey;

      const updated = await prisma.aiSetting.update({
        where: { id: Number(data.id) },
        data: {
          title: name,
          provider,
          value: keyToSave,
          model,
        },
      });

      return {
        id: updated.id,
        name: updated.title,
        providerType: updated.provider,
        apiKey: maskKey(updated.value),
        model: updated.model,
        isActive: updated.isActive,
      };
    }
  }

  // Count existing configs
  const count = await prisma.aiSetting.count();
  const shouldBeActive = count === 0; // If first config, make it active

  const created = await prisma.aiSetting.create({
    data: {
      title: name,
      provider,
      value: trimmedKey,
      model,
      isActive: shouldBeActive,
    },
  });

  return {
    id: created.id,
    name: created.title,
    providerType: created.provider,
    apiKey: maskKey(created.value),
    model: created.model,
    isActive: created.isActive,
  };
}

// ── Set active API config ─────────────────────────────────────────────
export async function setActiveConfig(id: number | string) {
  const targetId = Number(id);
  if (isNaN(targetId)) throw new Error("Invalid ID");

  // Deactivate all
  await prisma.aiSetting.updateMany({
    data: { isActive: false },
  });

  // Activate selected
  const activated = await prisma.aiSetting.update({
    where: { id: targetId },
    data: { isActive: true },
  });

  return {
    activeId: activated.id,
    name: activated.title,
    provider: activated.provider,
    model: activated.model,
  };
}

// ── Delete API config ─────────────────────────────────────────────────
export async function deleteAiConfig(id: number | string) {
  const targetId = Number(id);
  if (isNaN(targetId)) throw new Error("Invalid ID");

  const toDelete = await prisma.aiSetting.findUnique({
    where: { id: targetId },
  });

  await prisma.aiSetting.delete({
    where: { id: targetId },
  });

  // If deleted config was active, activate next available
  if (toDelete?.isActive) {
    const nextConfig = await prisma.aiSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (nextConfig) {
      await prisma.aiSetting.update({
        where: { id: nextConfig.id },
        data: { isActive: true },
      });
    }
  }

  return { deleted: true };
}

// ── Test Connection with live ping ─────────────────────────────────────
export async function testAiConnection(params?: {
  apiKey?: string;
  provider?: string;
  model?: string;
}) {
  let keyToTest = params?.apiKey?.trim();
  let providerToTest = params?.provider;
  let modelToTest = params?.model?.trim();

  if (!keyToTest || keyToTest.includes("...") || keyToTest.includes("•••")) {
    const active = await prisma.aiSetting.findFirst({
      where: { isActive: true },
    });
    if (active && active.value?.trim()) {
      keyToTest = active.value.trim();
      providerToTest = active.provider || "gemini";
      modelToTest = active.model || "default";
    } else if (process.env.GEMINI_API_KEY?.trim()) {
      keyToTest = process.env.GEMINI_API_KEY.trim();
      providerToTest = "gemini";
      modelToTest = "gemini-3.5-flash-lite";
    }
  }

  if (!keyToTest) {
    throw new Error("No API key available to test");
  }

  const cleanProvider = (providerToTest || detectProviderFromKey(keyToTest)).toLowerCase();
  const startTime = Date.now();

  if (cleanProvider === "gemini") {
    const genAI = new GoogleGenerativeAI(keyToTest);
    const m = genAI.getGenerativeModel({ model: modelToTest || "gemini-3.5-flash-lite" });
    const res = await m.generateContent("ping");
    const text = res.response.text();
    return {
      success: true,
      provider: "gemini",
      modelUsed: modelToTest || "gemini-3.5-flash-lite",
      latencyMs: Date.now() - startTime,
      message: `Gemini connected (${Date.now() - startTime}ms)`,
    };
  }

  // OpenAI-compatible providers (OpenRouter, Groq, OpenAI, DeepSeek)
  let endpoint = "https://openrouter.ai/api/v1/chat/completions";
  if (cleanProvider === "groq") endpoint = "https://api.groq.com/openai/v1/chat/completions";
  if (cleanProvider === "openai") endpoint = "https://api.openai.com/v1/chat/completions";
  if (cleanProvider === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${keyToTest}`,
  };

  if (cleanProvider === "openrouter") {
    headers["HTTP-Referer"] = "https://arman-mia.vercel.app";
    headers["X-Title"] = "Arman Mia Portfolio Chatbot";
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: modelToTest || (cleanProvider === "openrouter" ? "google/gemini-2.0-flash-exp:free" : "default"),
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    }),
  });

  const data: any = await response.json().catch(() => null);
  if (!response.ok || data?.error) {
    throw new Error(data?.error?.message || `HTTP ${response.status} rejected by ${cleanProvider.toUpperCase()}`);
  }

  return {
    success: true,
    provider: cleanProvider,
    modelUsed: modelToTest,
    latencyMs: Date.now() - startTime,
    message: `${cleanProvider.toUpperCase()} connected successfully (${Date.now() - startTime}ms)`,
  };
}

export const AiSettingService = {
  detectProviderFromKey,
  fetchRealModelsFromProvider,
  getAllAiConfigs,
  saveAiConfig,
  setActiveConfig,
  deleteAiConfig,
  testAiConnection,
};
