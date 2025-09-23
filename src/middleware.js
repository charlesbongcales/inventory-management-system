import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.clone();

  // Protect admin
  if (url.pathname.startsWith("/admin") && role !== "admin") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect user
  if (url.pathname.startsWith("/user") && role !== "user") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // apply only to these routes
};
