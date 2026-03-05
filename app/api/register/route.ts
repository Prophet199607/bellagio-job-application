import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { username, name, email, password, role } = await req.json();

        if (!username || !name || !email || !password) {
            return NextResponse.json(
                { message: "All Fields required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if ((existingUsers as any[]).length > 0) {
            return NextResponse.json(
                { message: "User with this email or username already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || "user";

        const query = "INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
        const values = [username, name, email, hashedPassword, userRole];

        await db.execute(query, values);

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
