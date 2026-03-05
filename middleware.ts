import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Auto-redirect from login page to dashboard if already logged in as admin
    if (pathname === "/admin" && token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
            const { payload } = await jwtVerify(token, secret);
            if (payload.role === "admin") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
        } catch (error) {
            // Token invalid, let them stay on login page
        }
    }

    // Protect /admin routes
    if (pathname.startsWith("/admin") && pathname !== "/admin") {
        if (!token) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== "admin") {
                return NextResponse.redirect(new URL("/", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error("Middleware JWT error:", error);
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
