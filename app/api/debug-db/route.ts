import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const [users] = await db.query("DESCRIBE users");
        const [applied] = await db.query("SHOW TABLES LIKE 'applied'");
        let appliedDesc = null;
        if ((applied as any[]).length > 0) {
            const [desc] = await db.query("DESCRIBE applied");
            appliedDesc = desc;
        }
        return NextResponse.json({ users, applied: appliedDesc });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
