import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { UnauthorizedError } from "../errors/app-error";

function extractBearerToken(req: Request): string | null {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

// Reusable factory so admin can get its own guard with no duplication
function requireBearerToken(expectedToken: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (extractBearerToken(req) !== expectedToken)
      throw new UnauthorizedError();
    next();
  };
}

export const resellerAuth = requireBearerToken(env.RESELLER_API_TOKEN);

export const adminAuth = requireBearerToken(env.ADMIN_API_TOKEN);
