"use client";

import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import StatsCards from "@/components/admin/StatsCards";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import VacanciesTab from "@/components/admin/VacanciesTab";
import UsersTab from "@/components/admin/UsersTab";
import VacancyModal from "@/components/admin/modals/VacancyModal";
import UserModal from "@/components/admin/modals/UserModal";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import { Vacancy, Application, Stats } from "@/app/types/admin";

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
    const [statusFilter, setStatusFilter] = useState<number>(1); // 1: Pending, 2: Approved, 3: Rejected
    const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
    const [status, setStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showStatus = (message: string, type: 'success' | 'error' = 'success') => {
        setStatus({ message, type });
        setTimeout(() => setStatus(null), 3000);
    };

    const filteredApplications = applications.filter(app => {
        // Status filter
        const matchesStatus = statusFilter === 0 ? true :
            statusFilter === 1 ? app.approval === 0 : // Pending
                statusFilter === 2 ? app.approval === 1 : // Approved
                    statusFilter === 3 ? app.approval === 2 : true; // Rejected

        if (!matchesStatus) return false;

        const matchesTitle = (app.vacancy_title?.toLowerCase() || '').includes(filterTitle.toLowerCase()) ||
            (app.first_name + ' ' + app.last_name).toLowerCase().includes(filterTitle.toLowerCase());
        const matchesExp = filterExp ? app.total_experience >= parseInt(filterExp) : true;
        const matchesDate = filterDate ? new Date(app.applied_date).toISOString().split('T')[0] === filterDate : true;
        return matchesTitle && matchesExp && matchesDate;
    });

    const toggleSelectAll = () => {
        if (selectedAppIds.length === filteredApplications.length && filteredApplications.length > 0) {
            setSelectedAppIds([]);
        } else {
            setSelectedAppIds(filteredApplications.map(app => app.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedAppIds(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    const handleBatchEmail = async (type: 'approval' | 'rejection', targetId?: string) => {
        const idsToUpdate = targetId ? [targetId] : selectedAppIds;
        if (idsToUpdate.length === 0) return;

        setLoading(true);
        try {
            const approvalStatus = type === 'approval' ? 1 : 2;

            for (const id of idsToUpdate) {
                await fetch('/api/applications', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, approval: approvalStatus })
                });
            }

            await fetchData();
            showStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated successfully for ${idsToUpdate.length} applicants!`);
            setSelectedAppIds([]);
            setSelectedApp(null);
        } catch (error) {
            showStatus('Failed to update status', 'error');
        } finally {
            setLoading(false);
        }
    };

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

            if (appsRes.ok) {
                const data = await appsRes.json();
                const normalizedApps = data.map((app: any) => ({
                    ...app,
                    approval: app.approval !== undefined ? app.approval : (app.Approval !== undefined ? app.Approval : 0)
                }));
                setApplications(normalizedApps);
            }
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
                                {activeTab === 'applications' ? 'Applications' :
                                    activeTab === 'vacancies' ? 'Vacancies' : 'Users'}
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
                    {stats && <StatsCards stats={stats} />}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#250026]"></div>
                        </div>
                    ) : activeTab === 'applications' ? (
                        <ApplicationsTab
                            applications={applications}
                            vacancies={vacancies}
                            filteredApplications={filteredApplications}
                            selectedApp={selectedApp}
                            setSelectedApp={setSelectedApp}
                            selectedAppIds={selectedAppIds}
                            setSelectedAppIds={setSelectedAppIds}
                            filterTitle={filterTitle}
                            setFilterTitle={setFilterTitle}
                            filterExp={filterExp}
                            setFilterExp={setFilterExp}
                            filterDate={filterDate}
                            setFilterDate={setFilterDate}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            onBatchEmail={handleBatchEmail}
                            onDelete={(id) => setDeleteConfirm({ id, type: 'application' })}
                            toggleSelectAll={toggleSelectAll}
                            toggleSelectOne={toggleSelectOne}
                        />
                    ) : activeTab === 'vacancies' ? (
                        <VacanciesTab
                            vacancies={vacancies}
                            onEdit={openEditModal}
                            onDelete={(id) => setDeleteConfirm({ id, type: 'vacancy' })}
                        />
                    ) : (
                        <UsersTab
                            users={users}
                            onDelete={(id) => setDeleteConfirm({ id, type: 'user' })}
                        />
                    )}
                </div>
            </main>

            {showVacancyModal && (
                <VacancyModal
                    editingVacancy={editingVacancy}
                    vacancyForm={vacancyForm}
                    setVacancyForm={setVacancyForm}
                    onSubmit={editingVacancy ? handleUpdateVacancy : handleCreateVacancy}
                    onClose={() => { setShowVacancyModal(false); resetForm(); }}
                />
            )}

            {showUserModal && (
                <UserModal
                    userForm={userForm}
                    setUserForm={setUserForm}
                    onSubmit={handleCreateUser}
                    onClose={() => { setShowUserModal(false); resetUserForm(); }}
                />
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
                <DeleteConfirmModal
                    type={deleteConfirm.type}
                    onConfirm={() => {
                        if (deleteConfirm.type === 'vacancy') handleDeleteVacancy(deleteConfirm.id);
                        else if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id);
                        else if (deleteConfirm.type === 'application') handleDeleteApplication(deleteConfirm.id);
                    }}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
}
