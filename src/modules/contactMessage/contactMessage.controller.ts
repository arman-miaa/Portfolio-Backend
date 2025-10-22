import { Request, Response } from "express";
import { contactMessageService } from "./contactMessage.service";

// Create new message (Public)
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await contactMessageService.createMessage({
      name,
      email,
      message,
    });
    res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get all messages (Admin only)
export const getAllMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await contactMessageService.getAllMessages();
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Delete message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await contactMessageService.deleteMessage(id);
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};
