import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const response = NextResponse.next();
    const hasFormSubmissions = request.cookies.get("hasFormSubmissions");

    if (hasFormSubmissions) {
      return NextResponse.redirect(new URL("/scout", request.url));
    }

    response.cookies.set("checkLocalStorage", "true", { maxAge: 10 });
    return response;
  }
}

export const config = {
  matcher: "/",
};
