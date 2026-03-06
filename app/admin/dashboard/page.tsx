"use client";

import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Vacancy {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    salary_range: string | null;
    status: 'Available' | 'Not Available';
    created_at: string;
}

interface Application {
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
}

interface Stats {
    totalApplications: number;
    totalVacancies: number;
    availableVacancies: number;
    applicationsThisMonth: number;
}

export default function AdminDashboard() {
    const { isAuthenticated, authLoading, logout } = useApp();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'vacancies' | 'applications' | 'users'>('applications');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [applications, setApplications] = useState<Application[]>([]);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [showVacancyModal, setShowVacancyModal] = useState(false);
    const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [filterTitle, setFilterTitle] = useState('');
    const [filterExp, setFilterExp] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [status, setStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showStatus = (message: string, type: 'success' | 'error' = 'success') => {
        setStatus({ message, type });
        setTimeout(() => setStatus(null), 3000);
    };

    const filteredApplications = applications.filter(app => {
        const matchesTitle = (app.vacancy_title?.toLowerCase() || '').includes(filterTitle.toLowerCase()) ||
            (app.first_name + ' ' + app.last_name).toLowerCase().includes(filterTitle.toLowerCase());
        const matchesExp = filterExp ? app.total_experience >= parseInt(filterExp) : true;
        const matchesDate = filterDate ? new Date(app.applied_date).toISOString().split('T')[0] === filterDate : true;
        return matchesTitle && matchesExp && matchesDate;
    });

    const [vacancyForm, setVacancyForm] = useState({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        status: 'Available' as 'Available' | 'Not Available'
    });

    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        name: 'Admin',
        email: 'email@gmail.com',
        role: 'admin'
    });

    const [deleteConfirm, setDeleteConfirm] = useState<{ id: any, type: 'vacancy' | 'user' | 'application' } | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push("/");
        } else {
            fetchData();
        }
    }, [isAuthenticated, authLoading, router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appsRes, vacanciesRes, statsRes, usersRes] = await Promise.all([
                fetch('/api/applications'),
                fetch('/api/vacancies'),
                fetch('/api/stats'),
                fetch('/api/users')
            ]);

            if (appsRes.ok) setApplications(await appsRes.json());
            if (vacanciesRes.ok) setVacancies(await vacanciesRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVacancy = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/vacancies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vacancyForm)
            });
            if (response.ok) {
                await fetchData();
                setShowVacancyModal(false);
                resetForm();
                showStatus('Vacancy created successfully');
            } else {
                showStatus('Failed to create vacancy', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
            console.error('Error creating vacancy:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVacancy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVacancy) return;
        setLoading(true);
        try {
            const response = await fetch('/api/vacancies', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...vacancyForm, id: editingVacancy.id })
            });
            if (response.ok) {
                await fetchData();
                setShowVacancyModal(false);
                setEditingVacancy(null);
                resetForm();
                showStatus('Vacancy updated successfully');
            } else {
                showStatus('Failed to update vacancy', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
            console.error('Error updating vacancy:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVacancy = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/vacancies?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                await fetchData();
                showStatus('Vacancy deleted successfully');
            } else {
                showStatus('Failed to delete vacancy', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
            console.error('Error deleting vacancy:', error);
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };

    const openEditModal = (vacancy: Vacancy) => {
        setEditingVacancy(vacancy);
        setVacancyForm({
            title: vacancy.title,
            description: vacancy.description || '',
            location: vacancy.location || '',
            salary_range: vacancy.salary_range || '',
            status: vacancy.status
        });
        setShowVacancyModal(true);
    };

    const resetForm = () => {
        setVacancyForm({ title: '', description: '', location: '', salary_range: '', status: 'Available' });
        setEditingVacancy(null);
    };

    const resetUserForm = () => {
        setUserForm({ username: '', password: '', name: 'user', email: 'email@gmail.com', role: 'user' });
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const uniqueEmail = `${userForm.username.toLowerCase().replace(/\s+/g, '')}.${Date.now()}@gmail.com`;
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userForm, email: uniqueEmail })
            });
            if (res.ok) {
                setShowUserModal(false);
                resetUserForm();
                await fetchData();
                showStatus('User created successfully');
            } else {
                const data = await res.json();
                showStatus(data.message || 'Error creating user', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchData();
                showStatus('User deleted successfully');
            } else {
                const data = await res.json();
                showStatus(data.message || 'Error deleting user', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };

    const handleDeleteApplication = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/applications?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchData();
                showStatus('Application deleted successfully');
                if (selectedApp?.id === id) setSelectedApp(null);
            } else {
                showStatus('Failed to delete application', 'error');
            }
        } catch (error) {
            showStatus('An error occurred', 'error');
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };

    if (authLoading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[200]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#250026]/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#250026] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-[11px] font-black text-[#250026] uppercase tracking-[0.3em] animate-pulse">Authenticating</p>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-white text-slate-900">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={async () => { await logout(); router.push("/"); }}
            />

            <main className="flex-1 overflow-auto bg-white">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-black text-[#250026] tracking-tight uppercase">
                                {activeTab === 'applications' ? 'Applications' : activeTab === 'vacancies' ? 'Vacancies' : 'Users'}
                            </h1>
                            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-0.5">Management Console</p>
                        </div>
                        {activeTab === 'vacancies' && (
                            <button
                                onClick={() => { resetForm(); setShowVacancyModal(true); }}
                                className="px-4 py-2 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                New Position
                            </button>
                        )}
                        {activeTab === 'users' && (
                            <button
                                onClick={() => { resetUserForm(); setShowUserModal(true); }}
                                className="px-4 py-2 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Admin
                            </button>
                        )}
                    </div>
                    {status && (
                        <div className={`mt-4 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {status.type === 'success' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                            {status.message}
                        </div>
                    )}
                </header>

                <div className="p-8">
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Applications', value: stats.totalApplications, color: 'text-slate-900' },
                                { label: 'Positions', value: stats.totalVacancies, color: 'text-slate-900' },
                                { label: 'Open', value: stats.availableVacancies, color: 'text-[#250026]' },
                                { label: 'Recent', value: stats.applicationsThisMonth, color: 'text-blue-500' },
                            ].map((s, i) => (
                                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group shadow-sm">
                                    <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">{s.label}</p>
                                    <p className={`text-2xl font-black mt-1 tracking-tighter ${s.color}`}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#250026]"></div>
                        </div>
                    ) : activeTab === 'applications' ? (
                        <div className={`grid grid-cols-1 ${selectedApp ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
                            <div className={`bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 ${selectedApp ? 'lg:col-span-2' : ''} shadow-xl`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="relative">
                                        <select
                                            value={filterTitle}
                                            onChange={(e) => setFilterTitle(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:border-[#250026] outline-none text-xs appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-white">All Roles</option>
                                            {Array.from(new Set(vacancies.map(v => v.title))).map((title, idx) => (
                                                <option key={idx} value={title} className="bg-white text-xs">{title}</option>
                                            ))}
                                        </select>
                                        <svg className="w-4 h-4 text-white/30 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={filterExp}
                                            placeholder="Min Exp"
                                            onChange={(e) => setFilterExp(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:border-[#250026] outline-none text-xs"
                                        />
                                        <svg className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:border-[#250026] outline-none text-xs [color-scheme:light]"
                                        />
                                        <svg className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Applicant</th>
                                                <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Role</th>
                                                <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Exp</th>
                                                <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Date</th>
                                                <th className="text-right py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600">
                                            {filteredApplications.map((app) => (
                                                <tr key={app.id} onClick={() => setSelectedApp(app)} className={`cursor-pointer hover:bg-slate-50 transition-all ${selectedApp?.id === app.id ? 'bg-[#250026]/5' : ''}`}>
                                                    <td className="py-4 px-5">
                                                        <div className="font-bold text-sm text-slate-900">{app.first_name} {app.last_name}</div>
                                                        <div className="text-[12px] text-slate-600 uppercase font-black">{app.email}</div>
                                                    </td>
                                                    <td className="py-4 px-5 text-xs text-slate-500">{app.vacancy_title}</td>
                                                    <td className="py-4 px-5"><span className="px-2 py-0.5 bg-[#250026]/10 rounded-md text-[12px] font-black text-[#250026] uppercase tracking-tighter">{app.total_experience} Yrs</span></td>
                                                    <td className="py-4 px-5 text-xs text-slate-600">{new Date(app.applied_date).toLocaleDateString()}</td>
                                                    <td className="py-4 px-5 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteConfirm({ id: app.id, type: 'application' });
                                                            }}
                                                            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredApplications.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center text-slate-600 italic text-sm">No records found matching your selection.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {selectedApp && (
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl h-fit sticky top-24 animate-in slide-in-from-right duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-xl font-black text-[#250026] tracking-tight truncate uppercase leading-none">{selectedApp.first_name}</h2>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight truncate uppercase mt-1">{selectedApp.last_name}</h2>
                                        </div>
                                        <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all text-slate-600 hover:text-[#250026]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Position</p>
                                            <p className="text-sm font-bold text-[#250026]">{selectedApp.vacancy_title}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Exp</p>
                                                <p className="text-xs font-bold text-slate-700">{selectedApp.total_experience} Yrs</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Salary</p>
                                                <p className="text-xs font-bold text-slate-700">{selectedApp.expected_salary}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Main Document</p>
                                            <a href={selectedApp.cv_file} target="_blank" className="flex items-center gap-3 px-4 py-3 bg-[#250026] text-white font-black rounded-xl hover:bg-[#3d0040] transition-all uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10 w-full">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Download CV
                                            </a>
                                        </div>

                                        {/* Educational Qualifications */}
                                        <div className="space-y-2">
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Educational Qualifications</p>
                                            <div className="space-y-2">
                                                {(() => {
                                                    try {
                                                        const files = JSON.parse(selectedApp.educational_files);
                                                        if (Array.isArray(files) && files.length > 0) {
                                                            return files.map((file: string, idx: number) => (
                                                                <a key={idx} href={file} target="_blank" className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#250026]/20 transition-all group">
                                                                    <div className="flex items-center gap-3">
                                                                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Education Doc {idx + 1}</span>
                                                                    </div>
                                                                    <svg className="w-4 h-4 text-slate-300 group-hover:text-[#250026] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                                </a>
                                                            ));
                                                        }
                                                        return <p className="text-[12px] italic text-slate-600 px-1">No educational documents uploaded.</p>;
                                                    } catch (e) {
                                                        return <p className="text-[12px] italic text-slate-600 px-1">Error loading documents.</p>;
                                                    }
                                                })()}
                                            </div>
                                        </div>

                                        {/* Professional Qualifications */}
                                        <div className="space-y-2">
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Professional Qualifications</p>
                                            <div className="space-y-2">
                                                {(() => {
                                                    try {
                                                        const files = selectedApp.professional_files ? JSON.parse(selectedApp.professional_files) : [];
                                                        if (Array.isArray(files) && files.length > 0) {
                                                            return files.map((file: string, idx: number) => (
                                                                <a key={idx} href={file} target="_blank" className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#250026]/20 transition-all group">
                                                                    <div className="flex items-center gap-3">
                                                                        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                                                                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Professional Doc {idx + 1}</span>
                                                                    </div>
                                                                    <svg className="w-4 h-4 text-slate-300 group-hover:text-[#250026] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                                </a>
                                                            ));
                                                        }
                                                        return <p className="text-[12px] italic text-slate-600 px-1">No professional documents uploaded.</p>;
                                                    } catch (e) {
                                                        return <p className="text-[12px] italic text-slate-600 px-1">Error loading documents.</p>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'vacancies' ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 overflow-hidden shadow-2xl">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr className="text-slate-600">
                                        <th className="text-left py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">Position</th>

                                        <th className="text-left py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">Status</th>
                                        <th className="text-right py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    {vacancies.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50 transition-all">
                                            <td className="py-4 px-6 font-bold text-sm text-slate-900 uppercase">{v.title}</td>

                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 rounded-md text-[12px] font-black uppercase tracking-tighter ${v.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEditModal(v)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteConfirm({ id: v.id, type: 'vacancy' })} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 overflow-hidden shadow-2xl">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr className="text-slate-600">

                                        <th className="text-left py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">ID</th>
                                        <th className="text-left py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">Role</th>
                                        <th className="text-right py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-all">

                                            <td className="py-4 px-6 text-xs font-bold text-slate-600 ">{u.username}</td>
                                            <td className="py-4 px-6"><span className={`px-4 py-1 rounded-md text-[12px] font-black  tracking-widest ${u.role === 'admin' ? 'bg-[#250026] text-white' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                                            <td className="py-4 px-6 text-right">
                                                <button onClick={() => setDeleteConfirm({ id: u.id, type: 'user' })} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {showVacancyModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-[#250026] tracking-tight uppercase">
                                {editingVacancy ? 'Edit Position' : 'New Position'}
                            </h2>
                            <button onClick={() => { setShowVacancyModal(false); resetForm(); }} className="text-slate-600 hover:text-[#250026]"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={editingVacancy ? handleUpdateVacancy : handleCreateVacancy} className="space-y-5">
                            <div>
                                <label className="block text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Job Title</label>
                                <input type="text" required value={vacancyForm.title} onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-[#250026] outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Manager" />
                            </div>
                            {editingVacancy && (
                                <div>
                                    <label className="block text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Status</label>
                                    <select value={vacancyForm.status} onChange={(e) => setVacancyForm({ ...vacancyForm, status: e.target.value as any })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm appearance-none cursor-pointer">
                                        <option value="Available" className="bg-white">Available</option>
                                        <option value="Not Available" className="bg-white">Not Available</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => { setShowVacancyModal(false); resetForm(); }} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10">
                                    {editingVacancy ? 'Save' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUserModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-[#250026] tracking-tight uppercase">Create Admin</h2>
                            <button onClick={() => { setShowUserModal(false); resetUserForm(); }} className="text-slate-600 hover:text-[#250026]"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="block text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Username</label>
                                <input type="text" required value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-[#250026] outline-none transition-all placeholder:text-slate-300" placeholder="johndoe" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
                                <input type="password" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-[#250026] outline-none transition-all placeholder:text-slate-300" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Role</label>
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm appearance-none cursor-pointer outline-none focus:border-[#250026] transition-all"
                                >
                                    <option value="admin" className="bg-white">Admin</option>
                                    <option value="user" className="bg-white">User</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => { setShowUserModal(false); resetUserForm(); }} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-[100] animate-in fade-in duration-300">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-[#250026]/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#250026] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-[12px] font-black text-[#250026] uppercase tracking-[0.3em] animate-pulse">Syncing Data</p>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Delete</h3>
                        <p className="text-sm text-slate-500 font-bold mb-8">Are you sure you want to permanently remove this {deleteConfirm.type}? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Back</button>
                            <button
                                onClick={() => {
                                    if (deleteConfirm.type === 'vacancy') handleDeleteVacancy(deleteConfirm.id);
                                    else if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id);
                                    else if (deleteConfirm.type === 'application') handleDeleteApplication(deleteConfirm.id);
                                }}
                                className="flex-1 py-3 bg-red-600 text-white font-black rounded-lg hover:bg-red-700 uppercase tracking-widest text-[12px] shadow-lg shadow-red-600/10"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
