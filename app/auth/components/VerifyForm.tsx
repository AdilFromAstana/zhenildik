"use client";
import { useState, useEffect, useRef } from "react";

export default function VerifyForm({
  userId,
  onSuccess,
  onBackToLogin,
}: {
  userId: number;
  onSuccess: (token: string) => void;
  onBackToLogin: () => void;
}) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // автофокус на поле при открытии
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, code }),
        }
      );

      const data = await res.json();

      if (res.ok && data.access_token) {
        onSuccess(data.access_token);
      } else {
        setErrorMsg(data.message || "Неверный код");
      }
    } catch {
      setErrorMsg("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Подтверждение</h1>
      <p className="text-gray-500 text-sm mb-6">
        Мы отправили 6-значный код подтверждения. Введите его ниже, чтобы
        завершить регистрацию.
      </p>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Код подтверждения
          </label>
          <input
            ref={inputRef}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="123456"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
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
          {loading ? "Проверяем..." : "Подтвердить"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium transition"
        >
          ← Назад к входу
        </button>
      </p>
    </div>
  );
}
