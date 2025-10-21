import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1]; 

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; 

    next(); 
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
