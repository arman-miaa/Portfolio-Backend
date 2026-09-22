"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overviewRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const overview_controller_1 = require("./overview.controller");
const router = (0, express_1.Router)();
// Protected overview route
router.get("/", auth_middleware_1.verifyToken, overview_controller_1.OverviewController.getOverview);
exports.overviewRoute = router;
