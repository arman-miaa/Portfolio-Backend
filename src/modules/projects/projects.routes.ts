
import express from "express";

import { verifyToken } from "../../middleware/auth.middleware";
import { ProjectController } from "./projects.controller";
const router = express.Router();

router.post("/",verifyToken, ProjectController.createProject)
router.get("/",ProjectController.getAllProjects)
router.get("/:id",ProjectController.getProjectById)
router.put("/:id", verifyToken, ProjectController.updateProject);
router.delete("/:id", verifyToken, ProjectController.deleteProject);


export const projectroute = router