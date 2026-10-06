import { Request, Response } from "express";
import { AiSettingService } from "./aiSetting.service";

const getSettings = async (_req: Request, res: Response) => {
  try {
    const data = await AiSettingService.getAllAiConfigs();
    return res.status(200).json({
      success: true,
      message: "AI settings fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch AI settings",
    });
  }
};

const saveConfig = async (req: Request, res: Response) => {
  try {
    const { id, name, providerType, apiKey, model } = req.body;
    if (!apiKey && !id) {
      return res.status(400).json({
        success: false,
        message: "API key is required",
      });
    }

    const data = await AiSettingService.saveAiConfig({
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
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to save AI config",
    });
  }
};

const setActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await AiSettingService.setActiveConfig(id);
    return res.status(200).json({
      success: true,
      message: "Active API key updated",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to update active key",
    });
  }
};

const deleteConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await AiSettingService.deleteAiConfig(id);
    return res.status(200).json({
      success: true,
      message: "API key deleted successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete API key",
    });
  }
};

const fetchModels = async (req: Request, res: Response) => {
  try {
    const { provider, apiKey } = req.body;
    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "Provider is required",
        data: [],
      });
    }

    const data = await AiSettingService.fetchRealModelsFromProvider(provider, apiKey);
    return res.status(200).json({
      success: true,
      message: "Models fetched successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to fetch models from API",
      data: [],
    });
  }
};

const testConnection = async (req: Request, res: Response) => {
  try {
    const { apiKey, provider, model } = req.body || {};
    const result = await AiSettingService.testAiConnection({
      apiKey,
      provider,
      model,
    });
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || "AI connection test failed",
    });
  }
};

export const AiSettingController = {
  getSettings,
  saveConfig,
  setActive,
  deleteConfig,
  fetchModels,
  testConnection,
};
