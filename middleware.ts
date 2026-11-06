// ============================================================
// Middleware: proteksi route /admin/*, redirect ke /login
// ============================================================
import { NextResponse, type NextRequest } from "next/server";
import { verifikasiToken, COOKIE_NAME } from "@/lib/auth/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifikasiToken(token) : null;

  // Halaman login: kalau sudah login, redirect ke admin/dashboard
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Semua route /admin/* wajib login
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Kalau wajib ganti password, paksa ke halaman ganti password
    // (kecuali sudah di halaman itu atau sedang logout)
    if (
      session.wajib_ganti_password &&
      pathname !== "/admin/ganti-password" &&
      pathname !== "/logout"
    ) {
      return NextResponse.redirect(new URL("/admin/ganti-password", req.url));
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
