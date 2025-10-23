"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessageRoute = void 0;
const express_1 = __importDefault(require("express"));
const contactMessage_controller_1 = require("./contactMessage.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", contactMessage_controller_1.createMessage);
router.get("/", auth_middleware_1.verifyToken, contactMessage_controller_1.getAllMessages);
router.delete("/:id", auth_middleware_1.verifyToken, contactMessage_controller_1.deleteMessage);
exports.contactMessageRoute = router;
