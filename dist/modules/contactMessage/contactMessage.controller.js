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
exports.deleteMessage = exports.getAllMessages = exports.createMessage = void 0;
const contactMessage_service_1 = require("./contactMessage.service");
// Create new message (Public)
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        const newMessage = yield contactMessage_service_1.contactMessageService.createMessage({
            name,
            email,
            message,
        });
        res.status(201).json({
            success: true,
            data: newMessage,
            message: "Message sent successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message,
        });
    }
});
exports.createMessage = createMessage;
// Get all messages (Admin only)
const getAllMessages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield contactMessage_service_1.contactMessageService.getAllMessages();
        res.status(200).json({
            success: true,
            data: messages,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
});
exports.getAllMessages = getAllMessages;
// Delete message
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield contactMessage_service_1.contactMessageService.deleteMessage(id);
        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: deleted,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message,
        });
    }
});
exports.deleteMessage = deleteMessage;
