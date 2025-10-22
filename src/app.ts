import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import path from "path";
import { router } from "./routes";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); 
app.use(compression()); 
app.use(express.json()); 
app.use(
  cors({
    origin: ["http://localhost:3000","https://arman-mia.vercel.app"],
    credentials: true,
  })
);


app.use("/api/v1",router)



// Home route
app.get("/", (_req:Request, res:Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});



// 404 Handler
app.use((_req:Request, res:Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
