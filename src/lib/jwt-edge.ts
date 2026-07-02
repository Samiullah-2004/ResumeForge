import { jwtVerify } from "jose";

// Next.js middleware runs on the Edge runtime, which doesn't support
// Node's `crypto` module — so `jsonwebtoken` (used in lib/jwt.ts for API
// routes) can't be used here. `jose` is built for Edge/Web Crypto and
// verifies the same HS256 tokens signed by lib/jwt.ts, so both stay
// compatible with each other.

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyTokenEdge(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
