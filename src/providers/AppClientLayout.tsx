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
    const checkAuth = async () => {
      try {
        const statusRes = await fetch('/api/auth/status');
        const statusData = await statusRes.json();

        if (!statusData.isAuthenticated) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const res = await fetch('/api/user/me');

        if (!res.ok) {
          await fetch('/api/auth/logout', { method: 'POST' });
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data);
      } catch (err) {
        console.error("Ошибка проверки токена:", err);
        // При ошибке сети или другом сбое также удаляем потенциально невалидный токен
        await fetch('/api/auth/logout', { method: 'POST' });
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });

    // 2. Сбрасываем клиентское состояние
    setIsAuthenticated(false);
    setUser(null);

    // 3. Редирект
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
        currentPath={pathname ?? "/"} // <-- ДОБАВЛЕНО
      />
    </main>
  );
}
