import compression from "compression";
// 🔥 পুরোনো cors import টি আর লাগবে না, কারণ এটি এখন config ফাইল থেকে আসছে
// import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import path from "path";
// 🔥 গুরুত্বপূর্ণ: নতুন CORS কনফিগারেশনটি আমদানি করা হলো

import { router } from "./routes";
import setupCors from "./config/cors.config";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compression());
app.use(express.json());

// 🔥 CORS Configuration: অন্যান্য middleware-এর আগে setupCors ফাংশনটি কল করা হলো
// এটি আপনার ফ্রন্টএন্ড ডোমেন থেকে কুকি সহ অনুরোধের অনুমতি দেবে।
setupCors(app as express.Express);

app.use("/api/v1", router);

// Home route
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
