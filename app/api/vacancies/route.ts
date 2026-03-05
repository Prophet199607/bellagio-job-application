import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET all vacancies
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM vacancies ORDER BY created_at DESC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch vacancies' },
            { status: 500 }
        );
    }
}

// POST new vacancy
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, location, salary_range, status } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO vacancies (title, description, location, salary_range, status) VALUES (?, ?, ?, ?, ?)',
            [title, description || null, location || null, salary_range || null, status || 'Available']
        );

        return NextResponse.json({
            id: result.insertId,
            title,
            description,
            location,
            salary_range,
            status: status || 'Available',
            message: 'Vacancy created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating vacancy:', error);
        return NextResponse.json(
            { error: 'Failed to create vacancy' },
            { status: 500 }
        );
    }
}

// DELETE vacancy
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Vacancy ID is required' },
                { status: 400 }
            );
        }

        await pool.query('DELETE FROM vacancies WHERE id = ?', [id]);

        return NextResponse.json({
            message: 'Vacancy deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        return NextResponse.json(
            { error: 'Failed to delete vacancy' },
            { status: 500 }
        );
    }
}

// PUT update vacancy
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, description, location, salary_range, status } = body;

        if (!id || !title) {
            return NextResponse.json(
                { error: 'ID and title are required' },
                { status: 400 }
            );
        }

        await pool.query(
            'UPDATE vacancies SET title = ?, description = ?, location = ?, salary_range = ?, status = ? WHERE id = ?',
            [title, description || null, location || null, salary_range || null, status || 'Available', id]
        );

        return NextResponse.json({
            message: 'Vacancy updated successfully'
        });
    } catch (error) {
        console.error('Error updating vacancy:', error);
        return NextResponse.json(
            { error: 'Failed to update vacancy' },
            { status: 500 }
        );
    }
}
