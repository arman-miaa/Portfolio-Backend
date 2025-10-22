import { Prisma, Blog } from "@prisma/client";
import { prisma } from "../../config/db";

const createBlog = async (payload: Prisma.BlogCreateInput): Promise<Blog> => {
    
  return prisma.blog.create({ data: payload });
};

const getAllBlogs = async (): Promise<Blog[]> => {
  return prisma.blog.findMany();
};

const getBlogById = async (id: number): Promise<Blog | null> => {
    console.log(id,'blog id');
  return prisma.blog.findUnique({ where: { id } });
};

const updateBlog = async (
  id: number,
  payload: Prisma.BlogUpdateInput
): Promise<Blog> => {
  return prisma.blog.update({
    where: { id },
    data: payload,
  });
};

const deleteBlog = async (id: number): Promise<Blog> => {
  return prisma.blog.delete({ where: { id } });
};

export const blogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
