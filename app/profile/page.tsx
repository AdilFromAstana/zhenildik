"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type UserData = {
  name: string;
  identifier: string; // email или телефон
  avatarUrl?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true); // загрузка именно профиля
  const [saving, setSaving] = useState(false); // общий saving для апдейтов
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // поля смены пароля
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // аватар локально
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchProfile() {
    setLoadingProfile(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMsg("Вы не авторизованы");
        setLoadingProfile(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        // ожидаем что бэк вернёт { name, identifier, avatarUrl? }
        const normalized: UserData = {
          name: data.name ?? "",
          identifier: data.identifier ?? "",
          avatarUrl: data.avatarUrl ?? "",
        };
        setUser(normalized);
      } else {
        setErrorMsg(data.message || "Не удалось загрузить профиль");
      }
    } catch {
      setErrorMsg("Ошибка сети при загрузке профиля");
    } finally {
      setLoadingProfile(false);
    }
  }

  // грузим профиль один раз при заходе
  useEffect(() => {
    fetchProfile();
  }, []);

  // ----------------- 2. сохранить имя -----------------
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Вы не авторизованы");
        setSaving(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
          }),
        }
      );

      if (res.ok) {
        setSuccessMsg("Профиль успешно обновлён");
        // можно заново перезапросить профиль, если бэк может менять больше, чем имя
        fetchProfile();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Ошибка обновления профиля");
      }
    } catch {
      setErrorMsg("Ошибка сети при обновлении профиля");
    } finally {
      setSaving(false);
    }
  }

  // ----------------- 3. смена пароля -----------------
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 6) {
      setErrorMsg("Новый пароль должен быть минимум 6 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Пароли не совпадают");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Вы не авторизованы");
        setSaving(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: password,
            newPassword,
          }),
        }
      );

      if (res.ok) {
        setSuccessMsg("Пароль успешно изменён");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Ошибка смены пароля");
      }
    } catch {
      setErrorMsg("Ошибка сети при смене пароля");
    } finally {
      setSaving(false);
    }
  }

  // ----------------- 4. загрузка аватарки -----------------
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // показать превью мгновенно
    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Вы не авторизованы");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        // сервер вернул новую ссылку на аватар
        setUser((prev) =>
          prev
            ? {
              ...prev,
              avatarUrl: data.avatarUrl || prev.avatarUrl,
            }
            : prev
        );
        setSuccessMsg("Аватар обновлён");
      } else {
        setErrorMsg(data.message || "Ошибка загрузки аватарки");
      }
    } catch {
      setErrorMsg("Ошибка сети при загрузке аватарки");
    }
  }

  // ----------------- рендер -----------------

  if (loadingProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 text-gray-600">
        Загрузка профиля...
      </main>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Личный кабинет
        </h1>

        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
            {successMsg}
          </div>
        )}

        {/* ==== АВАТАР ==== */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20">
            <Image
              src={avatarPreview || user?.avatarUrl || "/default-avatar.png"}
              alt="Аватар"
              fill
              className="rounded-full object-cover border border-gray-200 bg-gray-100"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition"
            >
              Загрузить новый
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        {/* ==== ОСНОВНЫЕ ДАННЫЕ ПРОФИЛЯ ==== */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={user?.name ?? ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email / Телефон
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-gray-50 cursor-not-allowed"
              value={user?.identifier ?? ""}
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full rounded-lg py-2.5 font-semibold text-white shadow-sm transition 
              ${saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {saving ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </form>

        {/* ==== СМЕНА ПАРОЛЯ ==== */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Сменить пароль
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Текущий пароль"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Новый пароль (мин. 6 символов)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <input
            type="password"
            placeholder="Повторите новый пароль"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={saving}
            className={`w-full rounded-lg py-2.5 font-semibold text-white shadow-sm transition 
              ${saving
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {saving ? "Обновляем..." : "Сменить пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
