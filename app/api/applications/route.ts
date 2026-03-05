import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all applications with vacancy details
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                a.*,
                v.title as vacancy_title,
                v.location as vacancy_location,
                v.status as vacancy_status
            FROM applied a
            LEFT JOIN vacancies v ON a.vacancy_id = v.id
            ORDER BY a.applied_date DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
        }

        await pool.query('DELETE FROM applied WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json(
            { error: 'Failed to delete application' },
            { status: 500 }
        );
    }
}
