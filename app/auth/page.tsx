"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import VerifyForm from "./components/VerifyForm";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = async (access_token: string) => {
    try {
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token }),
      });

      const returnUrl = searchParams.get("returnUrl");
      const targetUrl = returnUrl || "/profile";
      router.push(targetUrl);
    } catch (error) {
      console.error("Ошибка при установке куки и редиректе:", error);
      router.push("/");
    }
  };

  const handleNeedRegister = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setMode("register");
  };

  const handleStartVerify = (id: number) => {
    setUserId(id);
    setMode("verify");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        {mode === "login" && (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onNeedRegister={handleNeedRegister}
            onSwitchToRegister={() => setMode("register")}
            onNeedVerify={handleStartVerify}
          />
        )}

        {mode === "register" && (
          <RegisterForm
            identifier={identifier}
            password={password}
            onVerifyStart={handleStartVerify}
            onBackToLogin={() => setMode("login")}
            onAlreadyRegistered={(email) => {
              setIdentifier(email);
              setMode("login");
            }}
          />
        )}

        {mode === "verify" && userId && (
          <VerifyForm
            userId={userId}
            onSuccess={handleLoginSuccess}
            onBackToLogin={() => setMode("login")}
          />
        )}
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
      <AuthContent />
    </Suspense>
  );
}
