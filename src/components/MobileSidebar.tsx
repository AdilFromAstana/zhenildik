"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Home,
  Map,
  Briefcase,
  PlusCircle,
  User,
  LogOut,
} from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  currentPath: string;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  isAuthenticated,
  onLogout,
  currentPath
}: MobileSidebarProps) {
  const isActive = (itemPath: string) => {
    if (itemPath === currentPath) {
      return true;
    }

    if (itemPath === "/profile" && currentPath.startsWith("/profile/")) {
      return true;
    }

    if (itemPath === "/all-offers" && currentPath.startsWith("/offers/")) {
      if (currentPath === "/offers/my" || currentPath === "/offers/add") {
        return false;
      }
      return true;
    }

    return false;
  };

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goTo = (path: string) => {
    if (path === "/all-offers") {
      const city = localStorage.getItem("selectedCity") || "astana";
      router.push(`/offers/${city}`);
    } else {
      router.push(path);
    }
    onClose();
  };

  const items = [
    { label: "Главная", icon: Home, path: "/" },
    { label: "Каталог", icon: Map, path: "/all-offers" },
    ...(isAuthenticated
      ? [
        { label: "Мой профиль", icon: User, path: "/profile" },
        { label: "Мои акции", icon: Briefcase, path: "/offers/my" },
        { label: "Создать акцию", icon: PlusCircle, path: "/offers/add" },
      ]
      : []),
  ];

  const AuthIcon = isAuthenticated ? LogOut : User;
  const authLabel = isAuthenticated ? "Выйти" : "Войти";

  const handleAuth = () => {
    isAuthenticated ? onLogout() : router.push("/auth");
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      {/* фон */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"
          }`}
      />

      {/* панель */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Меню</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="py-4">
          <ul>
            {items.map(({ label, icon: Icon, path }) => {
              const active = isActive(path); // <-- ИСПОЛЬЗУЕМ
              return (
                <li key={path}>
                  <button
                    onClick={() => goTo(path)}
                    // СТИЛИЗАЦИЯ АКТИВНОГО ПУНКТА
                    className={`
                            w-full text-left px-6 py-3 flex items-center gap-3 transition
                            ${active
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                        `}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                </li>
              );
            })}

            <li>
              <button
                onClick={handleAuth}
                className="w-full text-left px-6 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <AuthIcon className="w-5 h-5" />
                {authLabel}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
