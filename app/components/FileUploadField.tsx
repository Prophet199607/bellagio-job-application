import React from "react";

interface FileUploadFieldProps {
    label: string;
    files: File | File[] | null;
    onChange: (files: File | File[] | null) => void;
    icon: React.ReactNode;
    required?: boolean;
    multiple?: boolean;
}

const FileUploadField = ({
    label,
    files,
    onChange,
    icon,
    required = false,
    multiple = false
}: FileUploadFieldProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        if (multiple) {
            const newFiles = Array.from(selectedFiles);
            const currentFiles = Array.isArray(files) ? files : files ? [files] : [];
            onChange([...currentFiles, ...newFiles]);
        } else {
            onChange(selectedFiles[0] || null);
        }

        // Reset the input value so the same file can be selected again if needed
        // and to ensure the "change" event fires reliably for subsequent adds
        e.target.value = "";
    };



    const renderFileList = () => {
        if (!files) return null;

        const fileList = Array.isArray(files) ? files : [files];
        if (fileList.length === 0) return null;

        return (
            <div className="flex flex-col gap-2 mt-3">
                {fileList.map((file, index) => {
                    const isImage = file.type.startsWith('image/');
                    const imageUrl = isImage ? URL.createObjectURL(file) : '';

                    return (
                        <div key={index} className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100 group/item hover:border-zinc-200 transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-white rounded-lg border border-zinc-100 shadow-sm w-12 h-12 flex items-center justify-center shrink-0">
                                    {isImage ? (
                                        <img
                                            src={imageUrl}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded-md"
                                            onLoad={() => URL.revokeObjectURL(imageUrl)}
                                        />
                                    ) : (
                                        <svg className="w-6 h-6 text-[#250026]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-zinc-700 truncate block w-full" title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-zinc-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (multiple && Array.isArray(files)) {
                                        const newFiles = [...(files as File[])];
                                        newFiles.splice(index, 1);
                                        onChange(newFiles.length ? newFiles : null);
                                    } else {
                                        onChange(null);
                                    }
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {/* Dropzone */}
            <div className="relative group border border-zinc-100 bg-zinc-50/30 hover:border-[#250026]/20 hover:bg-[#250026]/5 rounded-2xl p-8 transition-all text-center cursor-pointer shadow-sm border-dashed">
                <input
                    type="file"
                    required={required && !files}
                    multiple={multiple}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none transition-transform group-hover:scale-105 duration-200">
                    <div className="p-3 bg-white rounded-full shadow-sm text-zinc-400 group-hover:text-[#250026] transition-colors">
                        {icon}
                    </div>
                    <div className="text-zinc-600 font-medium text-sm">
                        {files ? (multiple ? "Add more files" : "Replace file") : (label.includes("CV") ? "Click to upload CV" : `Click to upload ${label}`)}
                    </div>
                    {multiple && <p className="text-xs text-zinc-400">Supported files: PDF, DOC, JPG</p>}
                </div>
            </div>

            {/* File List */}
            {renderFileList()}
        </div>
    );
};

export default FileUploadField;
