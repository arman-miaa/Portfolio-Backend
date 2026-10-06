"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSettingRoute = void 0;
const express_1 = require("express");
const aiSetting_controller_1 = require("./aiSetting.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin-only endpoints
router.get("/", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.getSettings);
router.post("/", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.saveConfig);
router.patch("/:id/active", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.setActive);
router.delete("/:id", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.deleteConfig);
router.post("/fetch-models", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.fetchModels);
router.post("/test", auth_middleware_1.verifyToken, aiSetting_controller_1.AiSettingController.testConnection);
exports.aiSettingRoute = router;
