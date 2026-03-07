import { Vacancy } from "@/app/types/admin";

interface VacancyModalProps {
    editingVacancy: Vacancy | null;
    vacancyForm: any;
    setVacancyForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export default function VacancyModal({ editingVacancy, vacancyForm, setVacancyForm, onSubmit, onClose }: VacancyModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-[#250026] tracking-tight uppercase">
                        {editingVacancy ? 'Edit Position' : 'New Position'}
                    </h2>
                    <button onClick={onClose} className="text-slate-600 hover:text-[#250026]"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form onSubmit={onSubmit} className="space-y-5">
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
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10">
                            {editingVacancy ? 'Save' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
