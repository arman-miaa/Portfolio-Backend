import { Router } from "express";
import { contactController } from "./contact.controller";
import { verifyToken } from "../../middleware/auth.middleware"; 
const router = Router();

router.post("/", verifyToken, contactController.createContact);
router.get("/", contactController.getAllContacts);
router.put("/:id", verifyToken, contactController.updateContact);
router.delete("/:id", verifyToken, contactController.deleteContact);

export const contactRoute = router;
