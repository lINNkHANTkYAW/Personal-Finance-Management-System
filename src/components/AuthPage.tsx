import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mail, User, Wallet, Globe } from "lucide-react";
import { translations } from "../lib/translations";
import type { Language } from "../types";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

interface AuthPageProps {
  onAuthenticated: (user: SessionUser) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function AuthPage({
  onAuthenticated,
  language,
  setLanguage,
}: AuthPageProps) {
  const t = translations[language];
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || t.authFailed);
        return;
      }

      onAuthenticated(result.user);
    } catch (err) {
      console.error(err);
      setError(t.serverUnreachable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
        <Globe size={14} className="text-slate-400 ml-1.5" />
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
            language === "en"
              ? "bg-emerald-500 text-white"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("ja")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
            language === "ja"
              ? "bg-emerald-500 text-white"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          日本語
        </button>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-4">
            <Wallet size={28} />
          </div>
          <h1 className="font-sans text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {t.brandName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {mode === "login" ? t.authLoginSubtitle : t.authSignupSubtitle}
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl p-7">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {t.signup}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 block">
                  {t.fullName}
                </span>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Alex Harrison"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 block">
                {t.email}
              </span>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 block">
                {t.password}
              </span>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder={mode === "signup" ? t.passwordHint : "••••••••"}
                />
              </div>
            </label>

            {error && (
              <div className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200/60 dark:border-red-800/40 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.pleaseWait}
                </>
              ) : mode === "login" ? (
                t.login
              ) : (
                t.createAccount
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
