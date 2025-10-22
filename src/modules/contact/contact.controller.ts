import { Request, Response } from "express";
import { contactService } from "./contact.service";

const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await contactService.createContact(req.body);
    res.status(201).json(contact);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create contact", error: error.message });
  }
};

const getAllContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.status(200).json(contacts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: error.message });
  }
};

const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await contactService.updateContact(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(contact);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update contact", error: error.message });
  }
};

const deleteContact = async (req: Request, res: Response) => {
  try {
    const contact = await contactService.deleteContact(Number(req.params.id));
    res.status(200).json(contact);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete contact", error: error.message });
  }
};

export const contactController = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
