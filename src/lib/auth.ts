import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "mv_admin";

function requireSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  sub: string; // admin user id
  email: string;
};

export async function signAdminSession(payload: AdminSession) {
  const secret = requireSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminSession(token: string) {
  const secret = requireSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as AdminSession;
}

export function getAdminToken(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function adminCookieName() {
  return COOKIE_NAME;
}











