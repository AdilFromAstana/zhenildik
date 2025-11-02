"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import MobileSidebar from "../components/MobileSidebar";
import { Toaster } from "react-hot-toast";

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const hiddenFooterPaths = ["/offers/add", "/login", "/register"];
  const showFooter = !hiddenFooterPaths.includes(pathname ?? "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data);
      } catch (err) {
        console.error("Ошибка проверки токена:", err);
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <AppHeader onOpenMobileMenu={() => setShowMobileMenu(true)} />

      <div className="flex-1 flex flex-col">{children}</div>

      {showFooter && <AppFooter />}

      <MobileSidebar
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </main>
  );
}
