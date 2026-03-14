"use client";

import { useState } from "react";
import { ClipboardList, Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (res.ok) window.location.href = "/dashboard";
      else { const d = await res.json(); setError(d.error || "Erreur"); }
    } catch { setError("Erreur de connexion"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ice-400/25">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[18px] font-semibold">ClientBrief</h1>
          <p className="text-txt-muted text-[12px] mt-1">Accès au dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card-glow p-8">
          <div className="mb-5">
            <label className="label-field flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-ice-500" /> Mot de passe</label>
            <input type="password" className="input-field" placeholder="Entrez le mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          </div>
          {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-600">{error}</div>}
          <button type="submit" disabled={loading || !password} className="btn-primary w-full !py-2.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
