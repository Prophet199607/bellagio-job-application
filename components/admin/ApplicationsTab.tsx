import { Application, Vacancy } from "@/app/types/admin";
import ApplicationDetail from "./ApplicationDetail";

interface ApplicationsTabProps {
    applications: Application[];
    vacancies: Vacancy[];
    filteredApplications: Application[];
    selectedApp: Application | null;
    setSelectedApp: (app: Application | null) => void;
    selectedAppIds: string[];
    setSelectedAppIds: React.Dispatch<React.SetStateAction<string[]>>;
    filterTitle: string;
    setFilterTitle: (val: string) => void;
    filterExp: string;
    setFilterExp: (val: string) => void;
    filterDate: string;
    setFilterDate: (val: string) => void;
    statusFilter: number;
    setStatusFilter: (val: number) => void;
    onBatchEmail: (type: 'approval' | 'rejection', id?: string) => void;
    onDelete: (id: string) => void;
    toggleSelectAll: () => void;
    toggleSelectOne: (id: string) => void;
}

export default function ApplicationsTab({
    vacancies,
    filteredApplications,
    selectedApp,
    setSelectedApp,
    selectedAppIds,
    setSelectedAppIds,
    filterTitle,
    setFilterTitle,
    filterExp,
    setFilterExp,
    filterDate,
    setFilterDate,
    statusFilter,
    setStatusFilter,
    onBatchEmail,
    onDelete,
    toggleSelectAll,
    toggleSelectOne
}: ApplicationsTabProps) {
    const statusOptions = [
        {
            id: 1, label: 'Pending', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 2, label: 'Approved', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 3, label: 'Rejected', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <div className={`grid grid-cols-1 ${selectedApp ? 'lg:grid-cols-4 whitespace-nowrap' : 'lg:grid-cols-1'} gap-6`}>
            <div className={`flex flex-col gap-6 ${selectedApp ? 'lg:col-span-3' : ''}`}>
                {/* Status Tabs Navigation */}
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-fit">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setStatusFilter(opt.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === opt.id
                                ? 'bg-white text-[#250026] shadow-md shadow-black/5 ring-1 ring-black/5'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl">
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
                            <svg className="w-4 h-4 text-slate-300 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
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

                    {selectedAppIds.length > 0 && (
                        <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left duration-300">
                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mr-2">{selectedAppIds.length} Selected</p>
                            <button
                                onClick={() => onBatchEmail('approval')}
                                className="px-4 py-2 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/10"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Approval Email
                            </button>
                            <button
                                onClick={() => onBatchEmail('rejection')}
                                className="px-4 py-2 bg-rose-600 text-white font-black rounded-lg hover:bg-rose-700 active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/10"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Rejected Email
                            </button>
                            <button
                                onClick={() => setSelectedAppIds([])}
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-4 px-5 text-left w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-[#250026] focus:ring-[#250026] cursor-pointer"
                                            checked={selectedAppIds.length === filteredApplications.length && filteredApplications.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Applicant</th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Job Title</th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Exp</th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Phone Number</th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Status</th>
                                    <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Date</th>
                                    {statusFilter === 2 && (
                                        <th className="text-left py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Email Status</th>
                                    )}
                                    <th className="text-right py-4 px-5 text-[12px] font-black text-slate-600 uppercase tracking-[0.2em]">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} onClick={() => setSelectedApp(app)} className={`cursor-pointer group hover:bg-slate-50 transition-all ${selectedApp?.id === app.id ? 'bg-[#250026]/5' : ''} ${selectedAppIds.includes(app.id) ? 'bg-emerald-50/30' : ''}`}>
                                        <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-[#250026] focus:ring-[#250026] cursor-pointer"
                                                checked={selectedAppIds.includes(app.id)}
                                                onChange={() => toggleSelectOne(app.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="font-bold text-sm text-slate-900">{app.first_name} {app.last_name}</div>
                                            <div className="text-[12px] text-slate-600 uppercase font-black tracking-tight">{app.email}</div>
                                        </td>
                                        <td className="py-4 px-5 text-xs text-slate-500 font-bold">{app.vacancy_title}</td>
                                        <td className="py-4 px-5"><span className="px-2 py-0.5 bg-[#250026]/5 rounded-md text-[11px] font-black text-[#250026] uppercase tracking-tighter border border-[#250026]/10">{app.total_experience} Yrs</span></td>
                                        <td className="py-4 px-5 text-xs text-slate-600 font-medium">{app.phone}</td>
                                        <td className="py-4 px-5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${app.approval === 1 ? 'bg-emerald-50 text-emerald-600' :
                                                app.approval === 2 ? 'bg-red-50 text-red-600' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {app.approval === 1 ? 'Approved' : app.approval === 2 ? 'Rejected' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-xs text-slate-600 font-medium">{new Date(app.applied_date).toLocaleDateString()}</td>

                                        {statusFilter === 2 && (
                                            <td className="py-4 px-5">
                                                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${app.email_send === 1 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${app.email_send === 1 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                    {app.email_send === 1 ? 'Email Sent' : 'Not Sent'}
                                                </span>
                                            </td>
                                        )}

                                        <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => onDelete(app.id)}
                                                className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApplications.length === 0 && (
                                    <tr>
                                        <td colSpan={statusFilter === 2 ? 9 : 8} className="py-20 text-center text-slate-400 italic text-sm font-black uppercase tracking-widest">No records found matching your selection.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedApp && (
                <div className="lg:col-span-1">
                    <ApplicationDetail
                        app={selectedApp}
                        onClose={() => setSelectedApp(null)}
                        onApprove={(id) => onBatchEmail('approval', id)}
                        onReject={(id) => onBatchEmail('rejection', id)}
                    />
                </div>
            )}
        </div>
    );
}
