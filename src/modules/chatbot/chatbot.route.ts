import { Router } from "express";
import { ChatbotController } from "./chatbot.controller";

const router = Router();

// Public route — no auth needed
router.post("/", ChatbotController.chat);

export const chatbotRoute = router;
