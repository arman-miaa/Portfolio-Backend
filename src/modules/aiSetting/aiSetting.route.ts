import { Router } from "express";
import { AiSettingController } from "./aiSetting.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

// Admin-only endpoints
router.get("/", verifyToken, AiSettingController.getSettings);
router.post("/", verifyToken, AiSettingController.saveConfig);
router.patch("/:id/active", verifyToken, AiSettingController.setActive);
router.delete("/:id", verifyToken, AiSettingController.deleteConfig);
router.post("/fetch-models", verifyToken, AiSettingController.fetchModels);
router.post("/test", verifyToken, AiSettingController.testConnection);

export const aiSettingRoute = router;
