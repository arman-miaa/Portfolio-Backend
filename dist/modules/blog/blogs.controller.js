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
exports.BlogController = void 0;
const blogs_service_1 = require("./blogs.service");
// Create
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blogs_service_1.blogService.createBlog(req.body);
        console.log("Created blog:", result);
        return res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while creating the blog",
            error: error instanceof Error ? error.message : error,
        });
    }
});
// Read all
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blogs_service_1.blogService.getAllBlogs();
        return res.json(blogs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while fetching blogs",
            error: error instanceof Error ? error.message : error,
        });
    }
});
// Read one
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const blog = yield blogs_service_1.blogService.getBlogById(id);
        if (!blog)
            return res.status(404).json({ message: "Blog not found" });
        return res.json(blog);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while fetching the blog",
            error: error instanceof Error ? error.message : error,
        });
    }
});
// Update
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const updatedBlog = yield blogs_service_1.blogService.updateBlog(id, req.body);
        return res.json(updatedBlog);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while updating the blog",
            error: error instanceof Error ? error.message : error,
        });
    }
});
// Delete
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield blogs_service_1.blogService.deleteBlog(id);
        return res.json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while deleting the blog",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.BlogController = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};
