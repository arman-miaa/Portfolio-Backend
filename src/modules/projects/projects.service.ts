import { Prisma, Project } from "@prisma/client";
import { prisma } from "../../config/db";

// Create Project
const createProject = async (
  payload: Prisma.ProjectCreateInput
): Promise<Project> => {
  const project = await prisma.project.create({
    data: payload,
  });
  return project;
};

// Get All Projects
const getAllProjects = async (): Promise<Project[]> => {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Get Project by ID
const getProjectById = async (id: number): Promise<Project | null> => {
  return await prisma.project.findUnique({
    where: { id },
  });
};

// Update Project
const updateProject = async (
  id: number,
  payload: Prisma.ProjectUpdateInput
): Promise<Project | null> => {
  // Check if project exists
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return null;

  return await prisma.project.update({
    where: { id },
    data: payload,
  });
};

// Delete Project
const deleteProject = async (id: number): Promise<Project | null> => {
  // Check if project exists
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return null;

  return await prisma.project.delete({
    where: { id },
  });
};

export const projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
