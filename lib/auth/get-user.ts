// ============================================================
// Helper: ambil user dari cookie (dipakai di server component)
// ============================================================
import "server-only";
import { cookies } from "next/headers";
import { verifikasiToken, COOKIE_NAME, type SessionPayload } from "./session";

/** Ambil user dari cookie saat ini. Return null jika belum login. */
export async function getUser(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifikasiToken(token);
}
