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
exports.skillController = void 0;
const skill_service_1 = require("./skill.service");
// Create skill
const createSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield skill_service_1.skillService.createSkill(req.body);
        res.status(201).json({ message: "Skill created", skill });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to create skill", error: error.message });
    }
});
// Get all skills
const getAllSkills = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield skill_service_1.skillService.getAllSkills();
        res.status(200).json({ skills });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch skills", error: error.message });
    }
});
// Get single skill
const getSkillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield skill_service_1.skillService.getSkillById(Number(req.params.id));
        if (!skill)
            return res.status(404).json({ message: "Skill not found" });
        res.status(200).json({ skill });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch skill", error: error.message });
    }
});
// Update skill
const updateSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skill = yield skill_service_1.skillService.updateSkill(Number(req.params.id), req.body);
        res.status(200).json({ message: "Skill updated", skill });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to update skill", error: error.message });
    }
});
// Delete skill
const deleteSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield skill_service_1.skillService.deleteSkill(Number(req.params.id));
        res.status(200).json({ message: "Skill deleted" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to delete skill", error: error.message });
    }
});
exports.skillController = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
};
