import { Router } from "express";
import {
  createExperience,
  getAllExperiences,

  updateExperience,
  deleteExperience,
} from "./experience.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/",verifyToken, createExperience);
router.get("/", getAllExperiences);

router.put("/:id",verifyToken, updateExperience);
router.delete("/:id",verifyToken, deleteExperience);

export const experienceRoutes = router;
