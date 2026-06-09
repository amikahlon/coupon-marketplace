import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

// **
// Catch all errors in one place and turn them into a consistent API response
// **
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error_code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found.`,
  });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error_code: err.errorCode,
      message: err.message,
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    error_code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again later.",
  });
}
