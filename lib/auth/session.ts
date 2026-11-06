// ============================================================
// Session JWT: buat, verifikasi, dan cookie helper
// ============================================================
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET wajib diisi minimal 32 karakter di .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "pengajian_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export interface SessionPayload {
  userId: string;
  username: string;
  nama: string;
  role: Role;
  desa_id: string | null;
  kelompok_id: string | null;
  wajib_ganti_password: boolean;
}

/** Buat JWT token dari payload */
export async function buatToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);
}

/** Verifikasi JWT token. Return null jika tidak valid. */
export async function verifikasiToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Set cookie session di response */
export function setSessionCookie(response: Response, token: string) {
  const maxAge = MAX_AGE;
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
}

/** Hapus cookie session */
export function clearSessionCookie(response: Response) {
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
}

export { COOKIE_NAME };
