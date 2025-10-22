import { Request, Response } from "express";
import { skillService } from "./skill.service";

// Create skill
const createSkill = async (req: Request, res: Response) => {
  try {
    const skill = await skillService.createSkill(req.body);
    res.status(201).json({ message: "Skill created", skill });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create skill", error: error.message });
  }
};

// Get all skills
const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await skillService.getAllSkills();
    res.status(200).json({ skills });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch skills", error: error.message });
  }
};

// Get single skill
const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await skillService.getSkillById(Number(req.params.id));
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.status(200).json({ skill });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch skill", error: error.message });
  }
};

// Update skill
const updateSkill = async (req: Request, res: Response) => {
  try {
    const skill = await skillService.updateSkill(
      Number(req.params.id),
      req.body
    );
    res.status(200).json({ message: "Skill updated", skill });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update skill", error: error.message });
  }
};

// Delete skill
const deleteSkill = async (req: Request, res: Response) => {
  try {
    await skillService.deleteSkill(Number(req.params.id));
    res.status(200).json({ message: "Skill deleted" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete skill", error: error.message });
  }
};

export const skillController = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
