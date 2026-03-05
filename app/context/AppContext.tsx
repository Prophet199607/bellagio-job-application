"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types
export interface JobApplication {
    id: string;
    appliedDate: string;
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        ageRange: string;
        gender: string;
        totalExperience: string;
        jobVacancy: string;
        expectedSalary: string;
    };
    files: {
        cv: File | null;
        educational: File | null | File[];
        professional: File[] | null;
    };
}

interface User {
    id: string;
    username: string;
    role: string;
}

interface AppContextType {
    vacancies: string[];
    applications: JobApplication[];
    user: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;
    logout: () => void;
    addVacancy: (title: string) => void;
    removeVacancy: (title: string) => void;
    addApplication: (app: JobApplication) => void;
    checkAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [vacancies, setVacancies] = useState<string[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const checkAuth = async () => {
        setAuthLoading(true);
        try {
            const res = await fetch("/api/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            // Still clear state as fallback
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const addVacancy = (title: string) => {
        if (!vacancies.includes(title)) {
            setVacancies([...vacancies, title]);
        }
    };

    const removeVacancy = (title: string) => {
        setVacancies(vacancies.filter((v) => v !== title));
    };

    const addApplication = (app: JobApplication) => {
        setApplications((prev) => [app, ...prev]);
    };

    return (
        <AppContext.Provider
            value={{
                vacancies,
                applications,
                user,
                isAuthenticated,
                authLoading,
                logout,
                addVacancy,
                removeVacancy,
                addApplication,
                checkAuth
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
