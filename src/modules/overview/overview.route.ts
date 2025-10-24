import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import { OverviewController } from "./overview.controller";

const router = Router();

// Protected overview route
router.get("/", verifyToken, OverviewController.getOverview);

export const overviewRoute = router;
