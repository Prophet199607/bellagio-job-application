import { Stats } from "@/app/types/admin";

interface StatsCardsProps {
    stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        { label: 'Total Applications', value: stats.totalApplications, color: 'text-slate-900' },
        { label: 'Positions', value: stats.totalVacancies, color: 'text-slate-900' },
        { label: 'Approved', value: stats.totalApproved, color: 'text-emerald-600' },
        { label: 'Rejected', value: stats.totalRejected, color: 'text-rose-600' },
        { label: 'Open', value: stats.availableVacancies, color: 'text-[#250026]' },
        { label: 'This Month', value: stats.applicationsThisMonth, color: 'text-blue-500' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {cards.map((s, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group shadow-sm">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{s.label}</p>
                    <p className={`text-xl font-black mt-1 tracking-tighter ${s.color}`}>{s.value}</p>
                </div>
            ))}
        </div>
    );
}
