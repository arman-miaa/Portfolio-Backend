import { Router } from "express";
import { KnowledgeController, upload } from "./knowledge.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

// All routes are admin-only (verifyToken)
router.post("/text", verifyToken, KnowledgeController.addText);
router.post("/pdf", verifyToken, upload.single("pdf"), KnowledgeController.addPDF);
router.get("/", verifyToken, KnowledgeController.getAll);
router.delete("/clear", verifyToken, KnowledgeController.clearAll);
router.delete("/:id", verifyToken, KnowledgeController.deleteOne);

export const knowledgeRoute = router;
