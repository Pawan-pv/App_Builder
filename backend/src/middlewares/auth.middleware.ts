// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}
