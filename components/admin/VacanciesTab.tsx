import { Vacancy } from "@/app/types/admin";

interface VacanciesTabProps {
    vacancies: Vacancy[];
    onEdit: (vacancy: Vacancy) => void;
    onDelete: (id: number) => void;
}

export default function VacanciesTab({ vacancies, onEdit, onDelete }: VacanciesTabProps) {
    return (
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
                                    <button onClick={() => onEdit(v)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => onDelete(v.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
