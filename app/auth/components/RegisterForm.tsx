"use client";
import { useState } from "react";

export default function RegisterForm({
  identifier,
  password,
  onVerifyStart,
  onBackToLogin,
  onAlreadyRegistered, // 👈 новый проп
}: {
  identifier: string;
  password: string;
  onVerifyStart: (userId: number) => void;
  onBackToLogin: () => void;
  onAlreadyRegistered: (identifier: string) => void;
}) {
  const [name, setName] = useState("");
  const [localIdentifier, setLocalIdentifier] = useState(identifier);
  const [localPassword, setLocalPassword] = useState(password);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (localPassword.length < 6) {
      setErrorMsg("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            identifier: localIdentifier,
            password: localPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.userId) {
        // status: CODE_SENT или CODE_RESENT – нам не важно
        onVerifyStart(data.userId);
        return;
      }

      // 🔹 кейс: пользователь уже подтверждён
      if (data.code === "USER_ALREADY_VERIFIED") {
        // переносим email/телефон в логин и переключаем режим
        onAlreadyRegistered(localIdentifier);
        return;
      }

      // 🔹 кейс: регистрация уже начата с другим паролем
      if (data.code === "SIGNUP_ALREADY_STARTED_DIFFERENT_PASSWORD") {
        setErrorMsg(
          data.message ||
            "Регистрация уже была начата с другим паролем. Попробуйте войти или сбросить пароль."
        );
        return;
      }

      setErrorMsg(data.message || "Ошибка регистрации");
    } catch {
      setErrorMsg("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Регистрация</h1>
      <p className="text-gray-500 text-sm mb-6">
        Укажите свои данные, чтобы создать аккаунт. Мы отправим код
        подтверждения.
      </p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="+7 777 123 45 67 или example@mail.com"
            value={localIdentifier}
            onChange={(e) => setLocalIdentifier(e.target.value.trim())}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Минимум 6 символов"
            type="password"
            value={localPassword}
            onChange={(e) => setLocalPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-2.5 font-semibold text-white shadow-sm transition 
            ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {loading ? "Отправляем код..." : "Зарегистрироваться"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Уже есть аккаунт?{" "}
        <button
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium transition"
        >
          Войти
        </button>
      </p>
    </div>
  );
}
