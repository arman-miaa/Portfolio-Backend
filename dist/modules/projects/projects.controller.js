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
exports.ProjectController = void 0;
const projects_service_1 = require("./projects.service");
// Create Project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield projects_service_1.projectService.createProject(req.body);
        return res.status(201).json({
            message: "Project created successfully",
            project: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to create project",
            error: error.message,
        });
    }
});
// Get All Projects
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield projects_service_1.projectService.getAllProjects();
        return res.status(200).json({
            message: "Projects fetched successfully",
            projects: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message,
        });
    }
});
// Get Single Project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield projects_service_1.projectService.getProjectById(Number(req.params.id));
        if (!result) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ project: result });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Failed to fetch project", error: error.message });
    }
});
// Update Project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield projects_service_1.projectService.updateProject(Number(req.params.id), req.body);
        if (!result) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res
            .status(200)
            .json({ message: "Project updated successfully", project: result });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Failed to update project", error: error.message });
    }
});
// Delete Project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield projects_service_1.projectService.deleteProject(Number(req.params.id));
        if (!result) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Failed to delete project", error: error.message });
    }
});
exports.ProjectController = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
};
