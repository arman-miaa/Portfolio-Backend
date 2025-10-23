"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillRoute = void 0;
const express_1 = __importDefault(require("express"));
const skill_controller_1 = require("./skill.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.verifyToken, skill_controller_1.skillController.createSkill);
router.get("/", skill_controller_1.skillController.getAllSkills);
router.get("/:id", auth_middleware_1.verifyToken, skill_controller_1.skillController.getSkillById);
router.put("/:id", auth_middleware_1.verifyToken, skill_controller_1.skillController.updateSkill);
router.delete("/:id", auth_middleware_1.verifyToken, skill_controller_1.skillController.deleteSkill);
exports.skillRoute = router;
