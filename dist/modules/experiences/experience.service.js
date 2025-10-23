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
exports.experienceService = void 0;
const db_1 = require("../../config/db");
//  Create Experience
const createExperience = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experience = yield db_1.prisma.experience.create({
            data: payload,
        });
        return experience;
    }
    catch (error) {
        console.error("Error creating experience:", error);
        throw new Error(error.message);
    }
});
//  Get All Experiences
const getAllExperiences = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.experience.findMany({
            orderBy: { startDate: "desc" },
        });
    }
    catch (error) {
        console.error("Error fetching experiences:", error);
        throw new Error(error.message);
    }
});
//  Update Experience
const updateExperience = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.experience.update({
            where: { id },
            data: payload,
        });
    }
    catch (error) {
        console.error("Error updating experience:", error);
        throw new Error(error.message);
    }
});
//  Delete Experience
const deleteExperience = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.experience.delete({ where: { id } });
    }
    catch (error) {
        console.error("Error deleting experience:", error);
        throw new Error(error.message);
    }
});
exports.experienceService = {
    createExperience,
    getAllExperiences,
    updateExperience,
    deleteExperience,
};
