import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET dashboard statistics
export async function GET() {
    try {
        // Total applications
        const [totalApps] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM applied'
        );

        // Total vacancies
        const [totalVacancies] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM vacancies'
        );

        // Available vacancies
        const [availableVacancies] = await pool.query<RowDataPacket[]>(
            "SELECT COUNT(*) as count FROM vacancies WHERE status = 'Available'"
        );

        // Applications this month
        const [thisMonth] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) as count FROM applied 
            WHERE MONTH(applied_date) = MONTH(CURRENT_DATE()) 
            AND YEAR(applied_date) = YEAR(CURRENT_DATE())
        `);

        // Applications by vacancy
        const [appsByVacancy] = await pool.query<RowDataPacket[]>(`
            SELECT 
                v.title,
                COUNT(a.id) as count
            FROM vacancies v
            LEFT JOIN applied a ON v.id = a.vacancy_id
            GROUP BY v.id, v.title
            ORDER BY count DESC
        `);

        return NextResponse.json({
            totalApplications: totalApps[0].count,
            totalVacancies: totalVacancies[0].count,
            availableVacancies: availableVacancies[0].count,
            applicationsThisMonth: thisMonth[0].count,
            applicationsByVacancy: appsByVacancy
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
