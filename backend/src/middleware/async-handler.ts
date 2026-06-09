import { Request, Response, NextFunction, RequestHandler } from "express";

// Send async errors to the error handler

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
