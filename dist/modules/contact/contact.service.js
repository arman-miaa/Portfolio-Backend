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
exports.contactService = void 0;
const db_1 = require("../../config/db");
const createContact = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.contactInfo.create({ data });
});
const getAllContacts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.contactInfo.findMany({ orderBy: { createdAt: "asc" } });
});
const updateContact = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.contactInfo.update({ where: { id }, data });
});
const deleteContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.contactInfo.delete({ where: { id } });
});
exports.contactService = {
    createContact,
    getAllContacts,
    updateContact,
    deleteContact,
};
