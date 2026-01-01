import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Known errors
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
    });
  }

  // Fallback
  return res.status(500).json({
    message: "Internal server error",
  });
}
