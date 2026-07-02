import { cookies } from "next/headers";

const COOKIE_NAME = "resumeforge_token";

/**
 * Sets the JWT as an httpOnly cookie.
 * httpOnly = JavaScript on the frontend cannot read this cookie at all,
 * which protects it from theft via XSS — a step up from storing the raw
 * token in localStorage.
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax", // sent on normal navigation, blocks most CSRF vectors
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches JWT expiry
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
