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
exports.contactController = void 0;
const contact_service_1 = require("./contact.service");
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield contact_service_1.contactService.createContact(req.body);
        res.status(201).json(contact);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to create contact", error: error.message });
    }
});
const getAllContacts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_service_1.contactService.getAllContacts();
        res.status(200).json(contacts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch contacts", error: error.message });
    }
});
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield contact_service_1.contactService.updateContact(Number(req.params.id), req.body);
        res.status(200).json(contact);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to update contact", error: error.message });
    }
});
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield contact_service_1.contactService.deleteContact(Number(req.params.id));
        res.status(200).json(contact);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to delete contact", error: error.message });
    }
});
exports.contactController = {
    createContact,
    getAllContacts,
    updateContact,
    deleteContact,
};
