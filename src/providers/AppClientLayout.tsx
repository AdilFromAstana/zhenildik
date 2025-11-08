"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import MobileSidebar from "../components/MobileSidebar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./AuthProvider";

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const hiddenFooterPaths = ["/offers/add", "/login", "/register"];
  const showFooter = !hiddenFooterPaths.includes(pathname ?? "");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await refresh(); // обновляем состояние auth контекста
    router.push("/");
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <AppHeader
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        // user={user}
        // isAuthenticated={isAuthenticated}
        // loading={loading}
      />

      <div className="flex-1 flex flex-col">{children}</div>

      {showFooter && <AppFooter />}

      <MobileSidebar
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        currentPath={pathname ?? "/"}
      />
    </main>
  );
}
