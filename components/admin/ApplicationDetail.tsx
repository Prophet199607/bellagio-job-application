import { Application } from "@/app/types/admin";

interface ApplicationDetailProps {
    app: Application;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function ApplicationDetail({ app, onClose, onApprove, onReject }: ApplicationDetailProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl h-fit sticky top-24 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${app.approval === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                app.approval === 2 ? 'bg-red-50 text-red-600 border border-red-100' :
                                    'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}>
                            {app.approval === 1 ? 'Approved' : app.approval === 2 ? 'Rejected' : 'Pending'}
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-[#250026] tracking-tight truncate uppercase leading-none">{app.first_name}</h2>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight truncate uppercase mt-1">{app.last_name}</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all text-slate-600 hover:text-[#250026]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Position</p>
                    <p className="text-sm font-bold text-[#250026]">{app.vacancy_title}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Exp</p>
                        <p className="text-xs font-bold text-slate-700">{app.total_experience} Yrs</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Salary</p>
                        <p className="text-xs font-bold text-slate-700">{app.expected_salary}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Main Document</p>
                    <a href={app.cv_file} target="_blank" className="flex items-center gap-3 px-4 py-3 bg-[#250026] text-white font-black rounded-xl hover:bg-[#3d0040] transition-all uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10 w-full mb-4">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download CV
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onApprove(app.id); }}
                            className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/10"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Approve
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onReject(app.id); }}
                            className="flex items-center justify-center gap-2 px-3 py-3 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/10"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Reject
                        </button>
                    </div>
                </div>

                {/* Educational Qualifications */}
                <div className="space-y-2">
                    <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Educational Qualifications</p>
                    <div className="space-y-2">
                        {(() => {
                            try {
                                const files = JSON.parse(app.educational_files);
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
                                const files = app.professional_files ? JSON.parse(app.professional_files) : [];
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
    );
}
