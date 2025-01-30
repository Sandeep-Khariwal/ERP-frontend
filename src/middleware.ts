import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LocalStorageKey } from "./app/api/LocalStorageUtility";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/auth" || path === "/auth";
  const token = request.cookies.get(LocalStorageKey.Token)?.value;
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/auth", "/:institute/:id/dashboard"],
};
