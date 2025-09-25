import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.clone();

  // Protect admin routes
  if (url.pathname.startsWith("/admin") && role !== "admin") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect user routes
  if (url.pathname.startsWith("/user") && role !== "employee") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware only to admin and user routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
