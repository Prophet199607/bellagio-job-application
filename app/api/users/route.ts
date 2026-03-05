import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const [rows] = await db.query("SELECT id, username, name, email, role FROM users");
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { username, password, name, email, role } = await req.json();

        if (!username || !password || !name || !email) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const [existing] = await db.query("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
        if ((existing as any[]).length > 0) {
            return NextResponse.json({ message: "Username or Email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)",
            [username, hashedPassword, name, email, role || 'admin']
        );

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "User ID required" }, { status: 400 });
        }

        // Prevent admin from deleting themselves
        if (payload.id === parseInt(id)) {
            return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 });
        }

        await db.query("DELETE FROM users WHERE id = ?", [id]);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user", error: error.message }, { status: 500 });
    }
}
