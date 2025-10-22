import { Request, Response } from "express";
import { projectService } from "./projects.service";

// Create Project
const createProject = async (req: Request, res: Response) => {
  try {
    const result = await projectService.createProject(req.body);
    return res.status(201).json({
      message: "Project created successfully",
      project: result,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// Get All Projects
const getAllProjects = async (req: Request, res: Response) => {
  try {
    const result = await projectService.getAllProjects();
    return res.status(200).json({
      message: "Projects fetched successfully",
      projects: result,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// Get Single Project by ID
const getProjectById = async (req: Request, res: Response) => {
  try {
    const result = await projectService.getProjectById(Number(req.params.id));
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ project: result });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch project", error: error.message });
  }
};

// Update Project
const updateProject = async (req: Request, res: Response) => {
  try {
    const result = await projectService.updateProject(
      Number(req.params.id),
      req.body
    );
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res
      .status(200)
      .json({ message: "Project updated successfully", project: result });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update project", error: error.message });
  }
};

// Delete Project
const deleteProject = async (req: Request, res: Response) => {
  try {
    const result = await projectService.deleteProject(Number(req.params.id));
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
