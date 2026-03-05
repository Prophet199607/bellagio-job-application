"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";

export default function AdminLogin() {
    const { checkAuth } = useApp();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Important: Update global auth state before redirecting
                await checkAuth();

                if (data.user.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-2xl w-full max-w-md border border-slate-100">
                <div className="flex justify-center mb-10">
                    <Image
                        src="/b-logo.png"
                        alt="Logo"
                        width={180}
                        height={80}
                        className="object-contain h-20 w-auto"
                        priority
                    />
                </div>

                <h1 className="text-3xl font-black text-[#250026] mb-2 text-center tracking-tight uppercase">Admin Login</h1>
                <p className="text-slate-400 text-sm text-center mb-10 font-bold uppercase tracking-widest">Management Portal</p>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-4 rounded-2xl mb-8 text-center font-bold uppercase tracking-wider">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Username or Email</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:border-[#250026] focus:ring-1 focus:ring-[#250026]/20 outline-none transition-all placeholder:text-slate-300"
                            placeholder="admin / john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:border-[#250026] focus:ring-1 focus:ring-[#250026]/20 outline-none transition-all placeholder:text-slate-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#250026] text-white font-black py-4 rounded-2xl hover:bg-[#3d0040] active:scale-[0.98] transition-all shadow-xl shadow-[#250026]/20 disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-[10px]"
                    >
                        {loading ? "Accessing Workspace..." : "Authorize Login"}
                    </button>

                    <div className="pt-6 border-t border-slate-100 mt-8">
                        <p className="text-center text-slate-400 text-[10px] uppercase font-black tracking-widest leading-loose mb-4">
                            New to the portal? <Link href="/register" className="text-[#250026] hover:underline ml-1">Create Account</Link> <br />
                            Security Protocol Active
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-[#250026] uppercase tracking-[0.2em] transition-all group"
                            >
                                <svg className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
