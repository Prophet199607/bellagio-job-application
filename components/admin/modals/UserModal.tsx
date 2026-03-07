interface UserModalProps {
    userForm: any;
    setUserForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export default function UserModal({ userForm, setUserForm, onSubmit, onClose }: UserModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-[#250026] tracking-tight uppercase">Create Admin</h2>
                    <button onClick={onClose} className="text-slate-600 hover:text-[#250026]"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form onSubmit={onSubmit} className="space-y-5">
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
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-[#250026] text-white font-black rounded-lg hover:bg-[#3d0040] uppercase tracking-widest text-[12px] shadow-lg shadow-[#250026]/10">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
