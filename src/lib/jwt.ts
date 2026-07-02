import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  // Fail loud at startup rather than silently signing tokens with "undefined"
  throw new Error("JWT_SECRET is not set in environment variables");
}

export type JwtPayload = {
  userId: string;
};

/** Signs a JWT for a given user. Expires in 7 days. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verifies a JWT and returns the decoded payload, or null if invalid/expired. */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
