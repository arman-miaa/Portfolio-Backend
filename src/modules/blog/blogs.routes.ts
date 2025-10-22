
import express from "express";
import { BlogController } from "./blogs.controller";
import { verifyToken } from "../../middleware/auth.middleware";
const router = express.Router();

router.post("/",verifyToken, BlogController.createBlog)
router.get("/",BlogController.getAllBlogs)
router.get("/:id",BlogController.getBlogById)
router.put("/:id", verifyToken, BlogController.updateBlog);
router.delete("/:id", verifyToken, BlogController.deleteBlog);


export const blgoRoute = router