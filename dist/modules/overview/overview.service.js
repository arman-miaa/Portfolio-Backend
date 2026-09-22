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
exports.OverviewService = void 0;
const db_1 = require("../../config/db");
const getOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogsCount = yield db_1.prisma.blog.count();
        const projectsCount = yield db_1.prisma.project.count();
        const skillsCount = yield db_1.prisma.skill.count();
        const experiencesCount = yield db_1.prisma.experience.count();
        const contactsCount = yield db_1.prisma.contactInfo.count();
        const messagesCount = yield db_1.prisma.contactMessage.count();
        return {
            blogs: blogsCount,
            projects: projectsCount,
            skills: skillsCount,
            experiences: experiencesCount,
            contacts: contactsCount,
            messages: messagesCount,
        };
    }
    catch (error) {
        throw new Error("Failed to fetch overview data");
    }
});
exports.OverviewService = { getOverview };
