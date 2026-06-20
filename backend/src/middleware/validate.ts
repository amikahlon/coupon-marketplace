import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError, ProductNotFoundError } from "../errors/app-error";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Validate req.body against a schema; on success swap in the parsed (typed) data.
export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Invalid request body.";
      throw new AppError(400, "VALIDATION_ERROR", message);
    }
    req.body = result.data;
    next();
  };
}

// Reject malformed UUIDs as 404 (keeps bad input off the uuid column).
export function validateUuidParam(paramName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (typeof value !== "string" || !UUID_REGEX.test(value)) {
      throw new ProductNotFoundError();
    }
    next();
  };
}
