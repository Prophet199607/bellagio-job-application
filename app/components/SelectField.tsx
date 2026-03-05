import React from "react";

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

const SelectField = ({
    label,
    value,
    onChange,
    options,
    required = true,
    className = "",
    icon
}: SelectFieldProps) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1">
            {icon && <span className="text-[#250026] opacity-70">{icon}</span>}
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <div className="relative">
            <select
                required={required}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50/50 text-slate-700 text-sm font-medium focus:border-[#250026] focus:ring-4 focus:ring-[#250026]/5 focus:bg-white outline-none transition-all appearance-none cursor-pointer shadow-sm shadow-slate-200/50"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="" className="bg-white text-slate-400">Select {label}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                        {opt.label}
                    </option>
                ))}
            </select>
            {/* Custom chevron */}
            <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

export default SelectField;
