"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props { onClose: () => void; onCreated: () => void; }

export function CreateBriefModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({ client_name: "", client_email: "", project_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async () => {
    if (!form.client_name || !form.client_email || !form.project_name) { setError("Tous les champs sont requis"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) { setFieldErrors({ client_email: ["Email invalide"] }); return; }
    setLoading(true); setError(""); setFieldErrors({});
    try {
      const res = await fetch("/api/briefs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); if (d.details) setFieldErrors(d.details); setError(d.error || "Erreur"); return; }
      onCreated();
    } catch { setError("Erreur de création"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(4,8,15,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="relative w-full max-w-md p-8 animate-slide-up glass-card-glow" style={{ borderRadius: 16 }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer text-txt-muted hover:text-txt-secondary" style={{ background: "rgba(255,255,255,0.04)" }}>
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-[18px] font-semibold text-txt-primary mb-1">Nouveau brief</h2>
        <p className="text-txt-muted text-[12px] mb-6">Un lien unique sera généré pour votre client.</p>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nom du client</label>
            <input type="text" className={`input-field ${fieldErrors.client_name ? "!border-[#EF4444]" : ""}`} placeholder="Jean Dupont" maxLength={255} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            {fieldErrors.client_name && <p className="text-[11px] mt-1" style={{ color: "#EF4444" }}>{fieldErrors.client_name[0]}</p>}
          </div>
          <div>
            <label className="label-field">Email du client</label>
            <input type="email" className={`input-field ${fieldErrors.client_email ? "!border-[#EF4444]" : ""}`} placeholder="jean@entreprise.fr" maxLength={255} value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
            {fieldErrors.client_email && <p className="text-[11px] mt-1" style={{ color: "#EF4444" }}>{fieldErrors.client_email[0]}</p>}
          </div>
          <div>
            <label className="label-field">Nom du projet</label>
            <input type="text" className={`input-field ${fieldErrors.project_name ? "!border-[#EF4444]" : ""}`} placeholder="Site vitrine Boulangerie Martin" maxLength={255} value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
          </div>
        </div>
        {error && <p className="mt-4 text-[12px] px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>{error}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1 cursor-pointer">Annuler</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer le brief"}
          </button>
        </div>
      </div>
    </div>
  );
}
