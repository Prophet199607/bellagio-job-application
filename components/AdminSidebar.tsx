"use client";

import Image from "next/image";

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeTab: 'vacancies' | 'applications' | 'users';
    setActiveTab: (tab: 'vacancies' | 'applications' | 'users') => void;
    onLogout: () => Promise<void>;
}

export default function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    onLogout
}: AdminSidebarProps) {
    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#250026] border-r border-white/5 transition-all duration-300 shadow-2xl shrink-0`}>
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    {sidebarOpen && (
                        <Image src="/b-logo.png" alt="Logo" width={120} height={40} className="h-8 w-auto brightness-125" />
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications'
                            ? 'bg-white text-[#250026] font-black shadow-lg shadow-black/10'
                            : 'text-white/40 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {sidebarOpen && <span className="text-[10px] uppercase font-black tracking-widest leading-none">Applications</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('vacancies')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'vacancies'
                            ? 'bg-white text-[#250026] font-black shadow-lg shadow-black/10'
                            : 'text-white/40 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                        </svg>
                        {sidebarOpen && <span className="text-[10px] uppercase font-black tracking-widest leading-none">Vacancies</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users'
                            ? 'bg-white text-[#250026] font-black shadow-lg shadow-black/10'
                            : 'text-white/40 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {sidebarOpen && <span className="text-[10px] uppercase font-black tracking-widest leading-none">Users</span>}
                    </button>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-300/60 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-black"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && <span className="text-[10px] uppercase tracking-widest leading-none">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
