import express from "express";
import { AuthController } from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/login", AuthController.loginWithEmailAndPassword);
router.post("/logout", AuthController.logout);
router.get("/me",verifyToken, AuthController.getCurrentUser); 

export const authRoute = router;
