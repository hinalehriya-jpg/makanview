import { NextResponse, type NextRequest } from "next/server";
import { getAdminToken, verifyAdminSession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Admin Auth Guard ───
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    const token = getAdminToken(req);
    if (!token) {
      if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    try {
      await verifyAdminSession(token);
    } catch {
      if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ─── Performance & Security Headers ───
  const res = NextResponse.next();

  // HSTS (force HTTPS for 1 year)
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Prevent clickjacking
  res.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // XSS protection
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // DNS prefetch for faster external resource loading
  res.headers.set("X-DNS-Prefetch-Control", "on");

  return res;
}

export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    "/api/admin/:path*",
    // Public pages (for security headers)
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};




