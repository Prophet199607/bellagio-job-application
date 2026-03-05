import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        // Support login by username or email
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, username]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const cookieStore = cookies();
        (await cookieStore).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, username: user.username, name: user.name, role: user.role }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}