"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeRoute = void 0;
const express_1 = require("express");
const knowledge_controller_1 = require("./knowledge.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes are admin-only (verifyToken)
router.post("/text", auth_middleware_1.verifyToken, knowledge_controller_1.KnowledgeController.addText);
router.post("/pdf", auth_middleware_1.verifyToken, knowledge_controller_1.upload.single("pdf"), knowledge_controller_1.KnowledgeController.addPDF);
router.get("/", auth_middleware_1.verifyToken, knowledge_controller_1.KnowledgeController.getAll);
router.delete("/clear", auth_middleware_1.verifyToken, knowledge_controller_1.KnowledgeController.clearAll);
router.delete("/:id", auth_middleware_1.verifyToken, knowledge_controller_1.KnowledgeController.deleteOne);
exports.knowledgeRoute = router;
