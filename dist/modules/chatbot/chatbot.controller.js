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
exports.ChatbotController = void 0;
const chatbot_service_1 = require("./chatbot.service");
const chat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        if (!message || typeof message !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Message is required" });
        }
        const reply = yield (0, chatbot_service_1.ragChat)(message.trim());
        return res.json({ success: true, reply });
    }
    catch (error) {
        console.error("Chat error:", error);
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : "AI is temporarily unavailable" });
    }
});
exports.ChatbotController = { chat };
