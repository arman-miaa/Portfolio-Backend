import express from "express";
import {
  createMessage,
  getAllMessages,
  deleteMessage,
} from "./contactMessage.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", createMessage); 
router.get("/",verifyToken, getAllMessages); 
router.delete("/:id",verifyToken, deleteMessage); 

export const contactMessageRoute = router;
