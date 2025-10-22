import { Prisma, Skill } from "@prisma/client";
import { prisma } from "../../config/db";

// Create a new skill
const createSkill = async (
  payload: Prisma.SkillCreateInput
): Promise<Skill> => {
  try {
    const skill = await prisma.skill.create({
      data: payload,
    });
    return skill;
  } catch (error: any) {
    console.error("Error creating skill:", error);
    throw new Error(error.message);
  }
};

// Get all skills
const getAllSkills = async (): Promise<Skill[]> => {
  try {
    return await prisma.skill.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error: any) {
    console.error("Error fetching skills:", error);
    throw new Error(error.message);
  }
};

// Get single skill by ID
const getSkillById = async (id: number): Promise<Skill | null> => {
  try {
    return await prisma.skill.findUnique({
      where: { id },
    });
  } catch (error: any) {
    console.error("Error fetching skill:", error);
    throw new Error(error.message);
  }
};

// Update a skill
const updateSkill = async (
  id: number,
  payload: Prisma.SkillUpdateInput
): Promise<Skill | null> => {
  try {
    return await prisma.skill.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    console.error("Error updating skill:", error);
    throw new Error(error.message);
  }
};

// Delete a skill
const deleteSkill = async (id: number): Promise<Skill | null> => {
  try {
    return await prisma.skill.delete({
      where: { id },
    });
  } catch (error: any) {
    console.error("Error deleting skill:", error);
    throw new Error(error.message);
  }
};

export const skillService = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
