"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blgoRoute = void 0;
const express_1 = __importDefault(require("express"));
const blogs_controller_1 = require("./blogs.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.verifyToken, blogs_controller_1.BlogController.createBlog);
router.get("/", blogs_controller_1.BlogController.getAllBlogs);
router.get("/:id", blogs_controller_1.BlogController.getBlogById);
router.put("/:id", auth_middleware_1.verifyToken, blogs_controller_1.BlogController.updateBlog);
router.delete("/:id", auth_middleware_1.verifyToken, blogs_controller_1.BlogController.deleteBlog);
exports.blgoRoute = router;
