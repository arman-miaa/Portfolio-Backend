"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotRoute = void 0;
const express_1 = require("express");
const chatbot_controller_1 = require("./chatbot.controller");
const router = (0, express_1.Router)();
// Public route — no auth needed
router.post("/", chatbot_controller_1.ChatbotController.chat);
exports.chatbotRoute = router;
