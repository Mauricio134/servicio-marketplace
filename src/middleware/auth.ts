import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string =
  process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export interface AuthRequest
  extends Request {
  userId?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid Token Format",
    });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        JWT_SECRET,
      ) as unknown as {
        userId: string;
      };

    req.userId =
      decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      message:
        "Expired or Invalid Token",
    });
  }
}
