"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import VerifyForm from "./components/VerifyForm";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/add-deal");
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
          />
        )}

        {mode === "register" && (
          <RegisterForm
            identifier={identifier}
            password={password}
            onVerifyStart={handleStartVerify}
            onBackToLogin={() => setMode("login")}
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
