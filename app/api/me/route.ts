import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json({
            user: {
                id: payload.id,
                role: payload.role,
                username: payload.username
            }
        });
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
