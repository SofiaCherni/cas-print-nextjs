import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal password gate for /admin/* and /api/admin/*. Single shared
 * password (ADMIN_PASSWORD env var) — appropriate for a single-owner shop,
 * not a multi-user permission system. The cookie stores a SHA-256 hash of
 * the password (via Web Crypto, available in the Edge middleware runtime),
 * never the password itself.
 */
const COOKIE_NAME = "cas_admin_session";

async function expectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    // Not configured — fail closed rather than leaving admin wide open.
    return NextResponse.json(
      { error: "ADMIN_PASSWORD не налаштовано на сервері." },
      { status: 503 }
    );
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const expected = await expectedToken(adminPassword);

  if (cookie === expected) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
