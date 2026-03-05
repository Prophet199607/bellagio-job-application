import React from "react";

interface InputFieldProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
    className?: string;
}

export const InputField = ({ label, type, placeholder, value, onChange, required = true, className = "" }: InputFieldProps) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-zinc-500">{label}</label>
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50/30 focus:border-zinc-300 outline-none transition-all text-zinc-600"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    className?: string;
}

export const SelectField = ({ label, value, onChange, options, required = true, className = "" }: SelectFieldProps) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium text-zinc-500">{label}</label>
        <select
            required={required}
            className="w-full px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50/30 focus:border-zinc-300 outline-none transition-all text-zinc-600 appearance-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select {label}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

interface FileUploadFieldProps {
    label: string;
    fileName: string | null;
    onChange: (file: File | null) => void;
    icon: React.ReactNode;
    required?: boolean;
}

export const FileUploadField = ({ label, fileName, onChange, icon, required = false }: FileUploadFieldProps) => (
    <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-500">
            {label} {required && <span className="text-zinc-400">*</span>}
        </label>
        <div className="relative group border border-zinc-100 bg-zinc-50/30 hover:border-zinc-300 rounded-2xl p-8 transition-colors text-center cursor-pointer">
            <input
                type="file"
                required={required}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
            />
            <div className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-zinc-500">
                    {fileName ? fileName : label.includes("CV") ? "Click to upload CV" : `Upload ${label}`}
                </span>
            </div>
        </div>
    </div>
);
