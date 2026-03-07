export interface Vacancy {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    salary_range: string | null;
    status: 'Available' | 'Not Available';
    created_at: string;
}

export interface Application {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    age_range: string | null;
    gender: string | null;
    total_experience: number;
    expected_salary: number;
    vacancy_id: number | null;
    cv_file: string;
    educational_files: string;
    professional_files: string | null;
    applied_date: string;
    vacancy_title: string | null;
    approval: number;
    email_send: number;
}

export interface Stats {
    totalApplications: number;
    totalVacancies: number;
    availableVacancies: number;
    applicationsThisMonth: number;
    totalApproved: number;
    totalRejected: number;
}
