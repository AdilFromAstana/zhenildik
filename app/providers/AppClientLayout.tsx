'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import MobileSidebar from "../components/MobileSidebar";

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<"user" | "business" | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUserRole(parsed.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUserRole(null);
        router.push("/");
    };

    return (
        <div className="flex flex-col min-h-screen relative">
            <AppHeader onOpenMobileMenu={() => setShowMobileMenu(true)} />
            <main className="flex-grow">{children}</main>
            <AppFooter />
            <MobileSidebar
                isOpen={showMobileMenu}
                onClose={() => setShowMobileMenu(false)}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                onLogout={handleLogout}
            />
        </div>
    );
}
