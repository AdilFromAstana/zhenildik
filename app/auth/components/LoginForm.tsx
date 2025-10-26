"use client";
import { useState } from "react";

export default function LoginForm({
  onSuccess,
  onNeedRegister,
  onSwitchToRegister,
}: {
  onSuccess: (token: string) => void;
  onNeedRegister: (email: string, pass: string) => void;
  onSwitchToRegister: () => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.access_token);
      } else if (data.message?.toLowerCase().includes("not found")) {
        onNeedRegister(identifier, password);
      } else {
        setErrorMsg(data.message || "Ошибка входа");
      }
    } catch {
      setErrorMsg("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Вход</h1>
      <p className="text-gray-500 text-sm mb-6">
        Введите свои данные, чтобы войти в систему
      </p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="example@mail.com или +7 777 123 45 67"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-2.5 font-semibold text-white shadow-sm transition 
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>

      {/* Ссылка снизу */}
      <p className="text-sm text-center text-gray-500 mt-6">
        Нет аккаунта?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 font-medium transition"
        >
          Зарегистрироваться
        </button>
      </p>
    </div>
  );
}
