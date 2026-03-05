import React from "react";

interface InputFieldProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

const InputField = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    required = true,
    className = "",
    icon
}: InputFieldProps) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1">
            {icon && <span className="text-[#250026] opacity-70">{icon}</span>}
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50/50 text-slate-800 text-sm font-medium focus:border-[#250026]/30 focus:ring-4 focus:ring-[#250026]/5 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-sm shadow-slate-200/50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default InputField;
