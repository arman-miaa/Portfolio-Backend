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
exports.AiSettingController = void 0;
const aiSetting_service_1 = require("./aiSetting.service");
const getSettings = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield aiSetting_service_1.AiSettingService.getAllAiConfigs();
        return res.status(200).json({
            success: true,
            message: "AI settings fetched successfully",
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch AI settings",
        });
    }
});
const saveConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, providerType, apiKey, model } = req.body;
        if (!apiKey && !id) {
            return res.status(400).json({
                success: false,
                message: "API key is required",
            });
        }
        const data = yield aiSetting_service_1.AiSettingService.saveAiConfig({
            id,
            name,
            providerType,
            apiKey,
            model,
        });
        return res.status(200).json({
            success: true,
            message: "API key saved successfully",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to save AI config",
        });
    }
});
const setActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield aiSetting_service_1.AiSettingService.setActiveConfig(id);
        return res.status(200).json({
            success: true,
            message: "Active API key updated",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to update active key",
        });
    }
});
const deleteConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield aiSetting_service_1.AiSettingService.deleteAiConfig(id);
        return res.status(200).json({
            success: true,
            message: "API key deleted successfully",
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to delete API key",
        });
    }
});
const fetchModels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { provider, apiKey } = req.body;
        if (!provider) {
            return res.status(400).json({
                success: false,
                message: "Provider is required",
                data: [],
            });
        }
        const data = yield aiSetting_service_1.AiSettingService.fetchRealModelsFromProvider(provider, apiKey);
        return res.status(200).json({
            success: true,
            message: "Models fetched successfully",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch models from API",
            data: [],
        });
    }
});
const testConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apiKey, provider, model } = req.body || {};
        const result = yield aiSetting_service_1.AiSettingService.testAiConnection({
            apiKey,
            provider,
            model,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "AI connection test failed",
        });
    }
});
exports.AiSettingController = {
    getSettings,
    saveConfig,
    setActive,
    deleteConfig,
    fetchModels,
    testConnection,
};
