import { Prisma, Experience } from "@prisma/client";
import { prisma } from "../../config/db";

//  Create Experience
const createExperience = async (
  payload: Prisma.ExperienceCreateInput
): Promise<Experience> => {
  try {
    const experience = await prisma.experience.create({
      data: payload,
    });
    return experience;
  } catch (error: any) {
    console.error("Error creating experience:", error);
    throw new Error(error.message);
  }
};

//  Get All Experiences
const getAllExperiences = async (): Promise<Experience[]> => {
  try {
    return await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    throw new Error(error.message);
  }
};



//  Update Experience
const updateExperience = async (
  id: number,
  payload: Prisma.ExperienceUpdateInput
): Promise<Experience> => {
  try {
    return await prisma.experience.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    console.error("Error updating experience:", error);
    throw new Error(error.message);
  }
};

//  Delete Experience
const deleteExperience = async (id: number): Promise<Experience> => {
  try {
    return await prisma.experience.delete({ where: { id } });
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    throw new Error(error.message);
  }
};

export const experienceService = {
  createExperience,
  getAllExperiences,

  updateExperience,
  deleteExperience,
};
