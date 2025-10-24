import { prisma } from "../../config/db";

const getOverview = async () => {
  try {
    const blogsCount = await prisma.blog.count();
    const projectsCount = await prisma.project.count(); 
    const skillsCount = await prisma.skill.count();
    const experiencesCount = await prisma.experience.count();
    const contactsCount = await prisma.contactInfo.count();
    const messagesCount = await prisma.contactMessage.count();

    return {
      blogs: blogsCount,
      projects: projectsCount,
      skills: skillsCount,
      experiences: experiencesCount,
      contacts: contactsCount,
      messages: messagesCount,
    };
  } catch (error) {
    throw new Error("Failed to fetch overview data");
  }
};

export const OverviewService = { getOverview };
