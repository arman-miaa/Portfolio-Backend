"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
// 🔥 পুরোনো cors import টি আর লাগবে না, কারণ এটি এখন config ফাইল থেকে আসছে
// import cors from "cors";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// 🔥 গুরুত্বপূর্ণ: নতুন CORS কনফিগারেশনটি আমদানি করা হলো
const routes_1 = require("./routes");
const cors_config_1 = __importDefault(require("./config/cors.config"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// 🔥 CORS Configuration: অন্যান্য middleware-এর আগে setupCors ফাংশনটি কল করা হলো
// এটি আপনার ফ্রন্টএন্ড ডোমেন থেকে কুকি সহ অনুরোধের অনুমতি দেবে।
(0, cors_config_1.default)(app);
app.use("/api/v1", routes_1.router);
// Home route
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});
exports.default = app;
