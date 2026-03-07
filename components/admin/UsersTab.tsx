interface UsersTabProps {
    users: any[];
    onDelete: (id: number) => void;
}

export default function UsersTab({ users, onDelete }: UsersTabProps) {
    return (
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
                            <td className="py-4 px-6"><span className={`px-4 py-1 rounded-md text-[12px] font-black tracking-widest ${u.role === 'admin' ? 'bg-[#250026] text-white' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                            <td className="py-4 px-6 text-right">
                                <button onClick={() => onDelete(u.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
