interface DeleteConfirmModalProps {
    type: 'vacancy' | 'user' | 'application';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({ type, onConfirm, onCancel }: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Confirm Delete</h3>
                <p className="text-sm text-slate-500 font-bold mb-8">Are you sure you want to permanently remove this {type}? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 text-slate-600 font-black rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[12px]">Back</button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 text-white font-black rounded-lg hover:bg-red-700 uppercase tracking-widest text-[12px] shadow-lg shadow-red-600/10"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
