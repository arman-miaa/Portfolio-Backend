import { prisma } from "../../config/db";
import { ContactInfo } from "@prisma/client";

const createContact = async (data: {
  type: string;
  value: string;
  label?: string;
}): Promise<ContactInfo> => {
  return await prisma.contactInfo.create({ data });
};

const getAllContacts = async (): Promise<ContactInfo[]> => {
  return await prisma.contactInfo.findMany({ orderBy: { createdAt: "asc" } });
};

const updateContact = async (
  id: number,
  data: { type?: string; value?: string; label?: string }
): Promise<ContactInfo | null> => {
  return await prisma.contactInfo.update({ where: { id }, data });
};

const deleteContact = async (id: number): Promise<ContactInfo | null> => {
  return await prisma.contactInfo.delete({ where: { id } });
};

export const contactService = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
