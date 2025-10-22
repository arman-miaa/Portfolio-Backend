import express from "express";
import { skillController } from "./skill.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", verifyToken, skillController.createSkill);
router.get("/", skillController.getAllSkills);
router.get("/:id",verifyToken, skillController.getSkillById);
router.put("/:id",verifyToken, skillController.updateSkill);
router.delete("/:id",verifyToken, skillController.deleteSkill);

export const skillRoute = router;
