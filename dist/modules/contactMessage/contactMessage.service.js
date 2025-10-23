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
exports.contactMessageService = void 0;
const db_1 = require("../../config/db");
// Create a new message
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield db_1.prisma.contactMessage.create({
            data: payload,
        });
        return message;
    }
    catch (error) {
        console.error("Error creating message:", error);
        throw new Error("Failed to create contact message");
    }
});
// Get all messages (for dashboard)
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        throw new Error("Failed to fetch messages");
    }
});
// Delete message
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.contactMessage.delete({
            where: { id },
        });
    }
    catch (error) {
        console.error("Error deleting message:", error);
        throw new Error("Failed to delete message");
    }
});
exports.contactMessageService = {
    createMessage,
    getAllMessages,
    deleteMessage,
};
