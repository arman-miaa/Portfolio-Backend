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
exports.AiSettingService = void 0;
exports.maskKey = maskKey;
exports.detectProviderFromKey = detectProviderFromKey;
exports.getProviderEndpoint = getProviderEndpoint;
exports.getDefaultModelForProvider = getDefaultModelForProvider;
exports.fetchRealModelsFromProvider = fetchRealModelsFromProvider;
exports.getAllAiConfigs = getAllAiConfigs;
exports.saveAiConfig = saveAiConfig;
exports.setActiveConfig = setActiveConfig;
exports.deleteAiConfig = deleteAiConfig;
exports.testAiConnection = testAiConnection;
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../../config/db");
function maskKey(key) {
    if (!key)
        return "";
    const trimmed = key.trim();
    if (trimmed.length <= 8)
        return "••••••••";
    return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}
function detectProviderFromKey(key) {
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
function getProviderEndpoint(provider, customBaseUrl) {
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
function getDefaultModelForProvider(provider) {
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
function fetchRealModelsFromProvider(provider, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const cleanProvider = (provider || "openrouter").toLowerCase();
        try {
            if (cleanProvider === "openrouter") {
                // OpenRouter models are public, optional key
                const headers = {};
                if (apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()) {
                    headers["Authorization"] = `Bearer ${apiKey.trim()}`;
                }
                const r = yield fetch("https://openrouter.ai/api/v1/models", { headers });
                const data = yield r.json();
                const rawList = data.data || [];
                // Sort free models first, then popular providers
                const models = rawList.map((m) => ({
                    id: m.id,
                    name: m.name || m.id,
                    isFree: m.id.includes(":free"),
                }));
                models.sort((a, b) => {
                    if (a.isFree && !b.isFree)
                        return -1;
                    if (!a.isFree && b.isFree)
                        return 1;
                    return a.name.localeCompare(b.name);
                });
                return models.map((m) => ({ id: m.id, name: m.name }));
            }
            if (cleanProvider === "gemini") {
                let keyToUse = apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim();
                if (!keyToUse) {
                    keyToUse = (_a = process.env.GEMINI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim();
                }
                if (!keyToUse) {
                    throw new Error("Gemini API key is required to load models");
                }
                const r = yield fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keyToUse}`);
                const data = yield r.json();
                if (!r.ok || data.error) {
                    throw new Error(((_b = data.error) === null || _b === void 0 ? void 0 : _b.message) || "Failed to load Gemini models");
                }
                const models = (data.models || [])
                    .filter((m) => { var _a; return (_a = m.supportedGenerationMethods) === null || _a === void 0 ? void 0 : _a.includes("generateContent"); })
                    .map((m) => ({
                    id: m.name.replace(/^models\//, ""),
                    name: m.displayName || m.name.replace(/^models\//, ""),
                }));
                return models;
            }
            if (cleanProvider === "groq") {
                if (!(apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()))
                    throw new Error("Groq API key required to load models");
                const r = yield fetch("https://api.groq.com/openai/v1/models", {
                    headers: { Authorization: `Bearer ${apiKey.trim()}` },
                });
                const data = yield r.json();
                if (!r.ok || data.error) {
                    throw new Error(((_c = data.error) === null || _c === void 0 ? void 0 : _c.message) || "Failed to load Groq models");
                }
                return (data.data || []).map((m) => ({ id: m.id, name: m.id }));
            }
            if (cleanProvider === "openai") {
                if (!(apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()))
                    throw new Error("OpenAI API key required to load models");
                const r = yield fetch("https://api.openai.com/v1/models", {
                    headers: { Authorization: `Bearer ${apiKey.trim()}` },
                });
                const data = yield r.json();
                if (!r.ok || data.error) {
                    throw new Error(((_d = data.error) === null || _d === void 0 ? void 0 : _d.message) || "Failed to load OpenAI models");
                }
                return (data.data || [])
                    .filter((m) => m.id.startsWith("gpt-") || m.id.startsWith("o1") || m.id.startsWith("o3"))
                    .sort((a, b) => a.id.localeCompare(b.id))
                    .map((m) => ({ id: m.id, name: m.id }));
            }
            if (cleanProvider === "deepseek") {
                if (!(apiKey === null || apiKey === void 0 ? void 0 : apiKey.trim()))
                    throw new Error("DeepSeek API key required to load models");
                const r = yield fetch("https://api.deepseek.com/models", {
                    headers: { Authorization: `Bearer ${apiKey.trim()}` },
                });
                const data = yield r.json();
                if (!r.ok || data.error) {
                    throw new Error(((_e = data.error) === null || _e === void 0 ? void 0 : _e.message) || "Failed to load DeepSeek models");
                }
                return (data.data || []).map((m) => ({ id: m.id, name: m.id }));
            }
            return [];
        }
        catch (err) {
            console.warn(`Error fetching models for ${provider}:`, err.message);
            throw err;
        }
    });
}
// ── Get all configured keys ───────────────────────────────────────────
function getAllAiConfigs() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const configs = yield db_1.prisma.aiSetting.findMany({
            orderBy: { createdAt: "desc" },
        });
        const envKey = ((_a = process.env.GEMINI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim()) || "";
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
    });
}
// ── Save or Update API Key config ─────────────────────────────────────
function saveAiConfig(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const trimmedKey = (_a = data.apiKey) === null || _a === void 0 ? void 0 : _a.trim();
        if (!trimmedKey) {
            throw new Error("API Key cannot be empty");
        }
        const provider = (data.providerType || detectProviderFromKey(trimmedKey)).toLowerCase();
        const name = ((_b = data.name) === null || _b === void 0 ? void 0 : _b.trim()) || `${provider.toUpperCase()} Key`;
        const model = ((_c = data.model) === null || _c === void 0 ? void 0 : _c.trim()) || "default";
        // If editing an existing config
        if (data.id && !isNaN(Number(data.id))) {
            const existing = yield db_1.prisma.aiSetting.findUnique({
                where: { id: Number(data.id) },
            });
            if (existing) {
                // If updating with masked key or empty, keep existing key
                const keyToSave = trimmedKey.includes("...") || trimmedKey.includes("•••")
                    ? existing.value
                    : trimmedKey;
                const updated = yield db_1.prisma.aiSetting.update({
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
        const count = yield db_1.prisma.aiSetting.count();
        const shouldBeActive = count === 0; // If first config, make it active
        const created = yield db_1.prisma.aiSetting.create({
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
    });
}
// ── Set active API config ─────────────────────────────────────────────
function setActiveConfig(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetId = Number(id);
        if (isNaN(targetId))
            throw new Error("Invalid ID");
        // Deactivate all
        yield db_1.prisma.aiSetting.updateMany({
            data: { isActive: false },
        });
        // Activate selected
        const activated = yield db_1.prisma.aiSetting.update({
            where: { id: targetId },
            data: { isActive: true },
        });
        return {
            activeId: activated.id,
            name: activated.title,
            provider: activated.provider,
            model: activated.model,
        };
    });
}
// ── Delete API config ─────────────────────────────────────────────────
function deleteAiConfig(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetId = Number(id);
        if (isNaN(targetId))
            throw new Error("Invalid ID");
        const toDelete = yield db_1.prisma.aiSetting.findUnique({
            where: { id: targetId },
        });
        yield db_1.prisma.aiSetting.delete({
            where: { id: targetId },
        });
        // If deleted config was active, activate next available
        if (toDelete === null || toDelete === void 0 ? void 0 : toDelete.isActive) {
            const nextConfig = yield db_1.prisma.aiSetting.findFirst({
                orderBy: { createdAt: "desc" },
            });
            if (nextConfig) {
                yield db_1.prisma.aiSetting.update({
                    where: { id: nextConfig.id },
                    data: { isActive: true },
                });
            }
        }
        return { deleted: true };
    });
}
// ── Test Connection with live ping ─────────────────────────────────────
function testAiConnection(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        let keyToTest = (_a = params === null || params === void 0 ? void 0 : params.apiKey) === null || _a === void 0 ? void 0 : _a.trim();
        let providerToTest = params === null || params === void 0 ? void 0 : params.provider;
        let modelToTest = (_b = params === null || params === void 0 ? void 0 : params.model) === null || _b === void 0 ? void 0 : _b.trim();
        if (!keyToTest || keyToTest.includes("...") || keyToTest.includes("•••")) {
            const active = yield db_1.prisma.aiSetting.findFirst({
                where: { isActive: true },
            });
            if (active && ((_c = active.value) === null || _c === void 0 ? void 0 : _c.trim())) {
                keyToTest = active.value.trim();
                providerToTest = active.provider || "gemini";
                modelToTest = active.model || "default";
            }
            else if ((_d = process.env.GEMINI_API_KEY) === null || _d === void 0 ? void 0 : _d.trim()) {
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
            const genAI = new generative_ai_1.GoogleGenerativeAI(keyToTest);
            const m = genAI.getGenerativeModel({ model: modelToTest || "gemini-3.5-flash-lite" });
            const res = yield m.generateContent("ping");
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
        if (cleanProvider === "groq")
            endpoint = "https://api.groq.com/openai/v1/chat/completions";
        if (cleanProvider === "openai")
            endpoint = "https://api.openai.com/v1/chat/completions";
        if (cleanProvider === "deepseek")
            endpoint = "https://api.deepseek.com/chat/completions";
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keyToTest}`,
        };
        if (cleanProvider === "openrouter") {
            headers["HTTP-Referer"] = "https://arman-mia.vercel.app";
            headers["X-Title"] = "Arman Mia Portfolio Chatbot";
        }
        const response = yield fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({
                model: modelToTest || (cleanProvider === "openrouter" ? "google/gemini-2.0-flash-exp:free" : "default"),
                messages: [{ role: "user", content: "ping" }],
                max_tokens: 5,
            }),
        });
        const data = yield response.json().catch(() => null);
        if (!response.ok || (data === null || data === void 0 ? void 0 : data.error)) {
            throw new Error(((_e = data === null || data === void 0 ? void 0 : data.error) === null || _e === void 0 ? void 0 : _e.message) || `HTTP ${response.status} rejected by ${cleanProvider.toUpperCase()}`);
        }
        return {
            success: true,
            provider: cleanProvider,
            modelUsed: modelToTest,
            latencyMs: Date.now() - startTime,
            message: `${cleanProvider.toUpperCase()} connected successfully (${Date.now() - startTime}ms)`,
        };
    });
}
exports.AiSettingService = {
    detectProviderFromKey,
    fetchRealModelsFromProvider,
    getAllAiConfigs,
    saveAiConfig,
    setActiveConfig,
    deleteAiConfig,
    testAiConnection,
};
