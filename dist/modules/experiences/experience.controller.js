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
exports.deleteExperience = exports.updateExperience = exports.getAllExperiences = exports.createExperience = void 0;
const experience_service_1 = require("./experience.service");
const createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experience = yield experience_service_1.experienceService.createExperience(req.body);
        res.status(201).json({
            message: "Experience created successfully",
            data: experience,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create experience",
            error: error.message,
        });
    }
});
exports.createExperience = createExperience;
const getAllExperiences = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield experience_service_1.experienceService.getAllExperiences();
        res.status(200).json({
            message: "All experiences fetched successfully",
            data: experiences,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch experiences",
            error: error.message,
        });
    }
});
exports.getAllExperiences = getAllExperiences;
const updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const experience = yield experience_service_1.experienceService.updateExperience(id, req.body);
        res.status(200).json({
            message: "Experience updated successfully",
            data: experience,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update experience",
            error: error.message,
        });
    }
});
exports.updateExperience = updateExperience;
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield experience_service_1.experienceService.deleteExperience(id);
        res.status(200).json({
            message: "Experience deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete experience",
            error: error.message,
        });
    }
});
exports.deleteExperience = deleteExperience;
