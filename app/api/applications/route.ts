import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET all applications with vacancy details
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                a.id, a.first_name, a.last_name, a.email, a.phone, a.address, 
                a.age_range, a.gender, a.total_experience, a.expected_salary, 
                a.vacancy_id, a.cv_file, a.educational_files, a.professional_files,
                a.approval as approval, a.email_send, a.applied_date,
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

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, approval } = body;

        if (!id || approval === undefined) {
            return NextResponse.json({ error: 'ID and approval status are required' }, { status: 400 });
        }

        await pool.query('UPDATE applied SET approval = ? WHERE id = ?', [approval, id]);
        return NextResponse.json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        return NextResponse.json(
            { error: 'Failed to update application status' },
            { status: 500 }
        );
    }
}
