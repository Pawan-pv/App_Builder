// src/middlewares/role.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export function requireCreator(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.role || req.user.role !== "CREATOR") {
    return res.status(403).json({ message: "Creator access required" });
  }
  next();
}
