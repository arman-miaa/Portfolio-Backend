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
exports.skillService = void 0;
const db_1 = require("../../config/db");
// Create a new skill
const createSkill = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield db_1.prisma.skill.create({
            data: payload,
        });
        return skill;
    }
    catch (error) {
        console.error("Error creating skill:", error);
        throw new Error(error.message);
    }
});
// Get all skills
const getAllSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.skill.findMany({
            orderBy: { createdAt: "asc" },
        });
    }
    catch (error) {
        console.error("Error fetching skills:", error);
        throw new Error(error.message);
    }
});
// Get single skill by ID
const getSkillById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.skill.findUnique({
            where: { id },
        });
    }
    catch (error) {
        console.error("Error fetching skill:", error);
        throw new Error(error.message);
    }
});
// Update a skill
const updateSkill = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.skill.update({
            where: { id },
            data: payload,
        });
    }
    catch (error) {
        console.error("Error updating skill:", error);
        throw new Error(error.message);
    }
});
// Delete a skill
const deleteSkill = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.skill.delete({
            where: { id },
        });
    }
    catch (error) {
        console.error("Error deleting skill:", error);
        throw new Error(error.message);
    }
});
exports.skillService = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
};
