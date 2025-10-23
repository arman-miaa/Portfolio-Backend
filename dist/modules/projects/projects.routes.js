"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectroute = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const projects_controller_1 = require("./projects.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.verifyToken, projects_controller_1.ProjectController.createProject);
router.get("/", projects_controller_1.ProjectController.getAllProjects);
router.get("/:id", projects_controller_1.ProjectController.getProjectById);
router.put("/:id", auth_middleware_1.verifyToken, projects_controller_1.ProjectController.updateProject);
router.delete("/:id", auth_middleware_1.verifyToken, projects_controller_1.ProjectController.deleteProject);
exports.projectroute = router;
