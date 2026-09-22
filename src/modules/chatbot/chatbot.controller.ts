import { Request, Response } from "express";
import { ragChat } from "./chatbot.service";

const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const reply = await ragChat(message.trim());

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat error:", error);
    return res
      .status(500)
      .json({ success: false, message: "AI is temporarily unavailable" });
  }
};

export const ChatbotController = { chat };
