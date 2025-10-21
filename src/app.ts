import compression from "compression";
import cors from "cors";
import express from "express";
import path from "path";
import { router } from "./routes";

const app = express();

// Middleware

app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use("/api/v1",router)


// Home route
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});



// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
