import { Request, Response } from "express";
import { blogService } from "./blogs.service";

// Create
const createBlog = async (req: Request, res: Response) => {
    try {
      

   const result = await blogService.createBlog(req.body);
   console.log("Created blog:", result);
   return res.status(201).json(result);

      
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while creating the blog",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Read all
const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await blogService.getAllBlogs();
    return res.json(blogs);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while fetching blogs",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Read one
const getBlogById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const blog = await blogService.getBlogById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.json(blog);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while fetching the blog",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Update
const updateBlog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedBlog = await blogService.updateBlog(id, req.body);
    return res.json(updatedBlog);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while updating the blog",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Delete
const deleteBlog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await blogService.deleteBlog(id);
    return res.json({ message: "Blog deleted successfully" });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while deleting the blog",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
