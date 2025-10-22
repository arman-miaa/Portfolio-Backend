import { Request, Response } from "express";
import { experienceService } from "./experience.service";

export const createExperience = async (req: Request, res: Response) => {
  try {
    const experience = await experienceService.createExperience(req.body);
    res.status(201).json({
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create experience",
      error: error.message,
    });
  }
};

export const getAllExperiences = async (_req: Request, res: Response) => {
  try {
    const experiences = await experienceService.getAllExperiences();
    res.status(200).json({
      message: "All experiences fetched successfully",
      data: experiences,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch experiences",
      error: error.message,
    });
  }
};


export const updateExperience = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); 

    const experience = await experienceService.updateExperience(id, req.body);

    res.status(200).json({
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update experience",
      error: error.message,
    });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); 

    await experienceService.deleteExperience(id);

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete experience",
      error: error.message,
    });
  }
};

