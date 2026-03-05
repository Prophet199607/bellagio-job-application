"use client";

import { useState, useEffect } from "react";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import FileUploadField from "@/app/components/FileUploadField";
import { useApp } from "@/app/context/AppContext";
import Image from "next/image";

// ─── SVG Icon Helper ──────────────────────────────────────────────
const Icon = ({ d, d2 }: { d: string; d2?: string }) => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={d2} />}
  </svg>
);

export default function JobApplicationForm() {
  const { addApplication } = useApp();
  const [availableVacancies, setAvailableVacancies] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    ageRange: "",
    gender: "",
    totalExperience: "",
    jobVacancy: "",
    expectedSalary: "",
  });

  const [files, setFiles] = useState<{
    cv: File | null;
    educational: File[] | null;
    professional: File[] | null;
  }>({ cv: null, educational: null, professional: null });

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    fetch("/api/vacancies")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAvailableVacancies(data.filter((v: any) => v.status === "Available")))
      .catch(() => { });
  }, []);

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.cv || !(files.educational && files.educational.length > 0)) {
      alert("Please upload both CV and at least one Educational Qualification document.");
      return;
    }
    setIsSubmitting(true);
    const submissionData = new FormData();
    Object.entries(formData).forEach(([k, v]) => submissionData.append(k, v));
    if (files.cv) submissionData.append("cv", files.cv);
    files.educational?.forEach((f) => submissionData.append("educational", f));
    files.professional?.forEach((f) => submissionData.append("professional", f));

    try {
      const response = await fetch("/api/apply", { method: "POST", body: submissionData });
      if (response.ok) {
        addApplication({ id: crypto.randomUUID(), appliedDate: new Date().toISOString(), formData, files });
        setIsSubmitted(true);
      } else {
        const err = await response.json();
        alert(`Failed: ${err.error || "Unknown error"}`);
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ───────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200 p-12 text-center border border-slate-100">
          <div className="w-24 h-24 bg-gradient-to-br from-[#250026] to-[#5a0060] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#250026]/30">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#250026] mb-2 uppercase tracking-tight">Application Sent!</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            Thank you, <span className="text-[#250026] font-black">{formData.firstName}</span>.<br />
            We've received your details and will be in touch soon.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-4 rounded-2xl bg-[#250026] text-white font-black hover:bg-[#3d0040] transition-all text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#250026]/30 active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progress = (step / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">

        {/* ─ Progress Bar ─ */}
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[#250026] to-[#7c1080] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ─ Header ─ */}
        <header className="bg-white px-8 md:px-12 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Image src="/b-logo.png" alt="Company Logo" width={120} height={60} className="object-contain h-12 w-auto" priority />
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#250026] tracking-tight uppercase leading-none">Job Application</h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Bellagio Recruitment Portal</p>
              </div>
            </div>
            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? "bg-[#250026] text-white shadow-lg shadow-[#250026]/30" : "bg-slate-100 text-slate-400"}`}>
                    {step > s ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : s}
                  </div>
                  {s < 2 && <div className={`w-8 h-0.5 transition-all ${step > s ? "bg-[#250026]" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ─ Form Body ─ */}
        <div className="p-8 md:p-12">
          {/* Phase Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-[#250026]/10 flex items-center justify-center text-[#250026]">
              {step === 1 ? (
                <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              ) : (
                <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Phase {step === 1 ? "01" : "02"} of 02</p>
              <p className="text-sm font-black text-[#250026] uppercase tracking-wider">{step === 1 ? "Personal Profile" : "Document Upload"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(v) => updateFormData("firstName", v)}
                  icon={<Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                />
                <InputField
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(v) => updateFormData("lastName", v)}
                  icon={<Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(v) => updateFormData("email", v)}
                  icon={<Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(v) => updateFormData("phone", v)}
                  required={false}
                  icon={<Icon d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                />
                <InputField
                  label="Home Address"
                  type="text"
                  placeholder="123 Street Name, City"
                  className="md:col-span-2"
                  value={formData.address}
                  onChange={(v) => updateFormData("address", v)}
                  required={false}
                  icon={<Icon d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                />
                <SelectField
                  label="Age Range"
                  value={formData.ageRange}
                  onChange={(v) => updateFormData("ageRange", v)}
                  required={false}
                  icon={<Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  options={[
                    { value: "18-24", label: "18 – 24 years" },
                    { value: "25-34", label: "25 – 34 years" },
                    { value: "35-44", label: "35 – 44 years" },
                    { value: "45+", label: "45+ years" },
                  ]}
                />
                <SelectField
                  label="Gender"
                  value={formData.gender}
                  onChange={(v) => updateFormData("gender", v)}
                  required={false}
                  icon={<Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Prefer not to say" },
                  ]}
                />
                <InputField
                  label="Total Experience (Years)"
                  type="number"
                  placeholder="e.g. 5"
                  value={formData.totalExperience}
                  onChange={(v) => updateFormData("totalExperience", v)}
                  required={false}
                  icon={<Icon d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />}
                />
                <InputField
                  label="Expected Salary (LKR)"
                  type="number"
                  placeholder="e.g. 150000"
                  value={formData.expectedSalary}
                  onChange={(v) => updateFormData("expectedSalary", v)}
                  required={false}
                  icon={<Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                />

                {/* Job Vacancy */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <span className="text-[#250026] opacity-70">
                      <Icon d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                    </span>
                    Job Vacancy
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.jobVacancy}
                      onChange={(e) => updateFormData("jobVacancy", e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:border-[#250026] focus:ring-2 focus:ring-[#250026]/10 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a Position</option>
                      {availableVacancies.map((v) => (
                        <option key={v.id} value={v.title}>{v.title}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Info banner */}
                <div className="bg-[#250026]/5 border border-[#250026]/10 rounded-2xl px-5 py-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#250026] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-bold text-[#250026]/70 leading-relaxed">
                    Please upload your documents below. Accepted formats: <span className="font-black">PDF, DOC, JPG, PNG</span>. CV and Educational Qualifications are <span className="font-black">required</span>.
                  </p>
                </div>

                <FileUploadField
                  label="Curriculum Vitae (CV)"
                  required={true}
                  files={files.cv}
                  onChange={(f) => setFiles({ ...files, cv: f as File | null })}
                  icon={
                    <svg className="w-8 h-8 text-zinc-300 group-hover:text-[#250026] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  }
                />
                <FileUploadField
                  label="Educational Qualifications"
                  required={true}
                  files={files.educational}
                  multiple={true}
                  onChange={(f) => setFiles({ ...files, educational: f as File[] | null })}
                  icon={
                    <svg className="w-8 h-8 text-zinc-300 group-hover:text-[#250026] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  }
                />
                <FileUploadField
                  label="Professional Qualifications"
                  files={files.professional}
                  multiple={true}
                  onChange={(f) => setFiles({ ...files, professional: f as File[] | null })}
                  icon={
                    <svg className="w-8 h-8 text-zinc-300 group-hover:text-[#250026] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              </div>
            )}

            {/* ─ Navigation ─ */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-all text-[10px] uppercase tracking-[0.2em] group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
              ) : <div />}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.jobVacancy}
                  className="flex items-center gap-2 ml-auto px-8 py-3.5 rounded-2xl bg-[#250026] text-white font-black hover:bg-[#3d0040] disabled:opacity-30 transition-all shadow-xl shadow-[#250026]/30 text-[10px] uppercase tracking-[0.2em] group active:scale-[0.98]"
                >
                  Next Step
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 ml-auto px-8 py-3.5 rounded-2xl bg-[#250026] text-white font-black hover:bg-[#3d0040] disabled:opacity-50 transition-all shadow-xl shadow-[#250026]/30 text-[10px] uppercase tracking-[0.2em] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
