import { Prisma, ContactMessage } from "@prisma/client";
import { prisma } from "../../config/db";

// Create a new message
const createMessage = async (
  payload: Prisma.ContactMessageCreateInput
): Promise<ContactMessage> => {
  try {
    const message = await prisma.contactMessage.create({
      data: payload,
    });
    return message;
  } catch (error: any) {
    console.error("Error creating message:", error);
    throw new Error("Failed to create contact message");
  }
};

// Get all messages (for dashboard)
const getAllMessages = async (): Promise<ContactMessage[]> => {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};

// Delete message
const deleteMessage = async (id: number): Promise<ContactMessage | null> => {
  try {
    return await prisma.contactMessage.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }
};

export const contactMessageService = {
  createMessage,
  getAllMessages,
  deleteMessage,
};
