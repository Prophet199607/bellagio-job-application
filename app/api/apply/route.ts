
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract fields
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const ageRange = formData.get("ageRange") as string;
        const gender = formData.get("gender") as string;
        const totalExperience = formData.get("totalExperience") ? parseInt(formData.get("totalExperience") as string) : null;
        const expectedSalary = formData.get("expectedSalary") ? parseFloat(formData.get("expectedSalary") as string) : null;
        const jobVacancyTitle = formData.get("jobVacancy") as string;

        // Files
        const cvFile = formData.get("cv") as File | null;
        const educationalFiles = formData.getAll("educational") as File[];
        const professionalFiles = formData.getAll("professional") as File[];

        if (!cvFile) {
            return NextResponse.json({ error: "CV file is required" }, { status: 400 });
        }

        // 1. Get Vacancy ID
        // We need to look up the vacancy ID based on the title.
        // Assuming the vacancies table is populated.
        let vacancyId: number | null = null;
        if (jobVacancyTitle) {
            const [rows] = await db.execute<RowDataPacket[]>(
                "SELECT id FROM vacancies WHERE title = ? LIMIT 1",
                [jobVacancyTitle]
            );
            if (rows.length > 0) {
                vacancyId = rows[0].id;
            }
        }

        // 2. Handle File Uploads
        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        async function saveFile(file: File): Promise<string> {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            return `/uploads/${filename}`;
        }

        const cvPath = await saveFile(cvFile);

        // Process educational files
        const educationalPaths: string[] = [];
        for (const file of educationalFiles) {
            if (file instanceof File) { // Ensure it's a file
                educationalPaths.push(await saveFile(file));
            }
        }

        // Process professional files
        const professionalPaths: string[] = [];
        for (const file of professionalFiles) {
            if (file instanceof File) { // Ensure it's a file
                professionalPaths.push(await saveFile(file));
            }
        }

        // 3. Insert into Database
        const applicationId = crypto.randomUUID();

        const query = `
      INSERT INTO applied (
        id, first_name, last_name, email, phone, address, age_range, gender, 
        total_experience, expected_salary, vacancy_id, cv_file, 
        educational_files, professional_files
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await db.execute(query, [
            applicationId,
            firstName,
            lastName,
            email,
            phone,
            address,
            ageRange,
            gender,
            totalExperience,
            expectedSalary,
            vacancyId,
            cvPath,
            JSON.stringify(educationalPaths),
            JSON.stringify(professionalPaths)
        ]);

        return NextResponse.json({ success: true, message: "Application submitted successfully", id: applicationId });

    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
