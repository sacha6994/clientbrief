"use client";

import { useState } from "react";
import { X, Loader2, Send, Mail } from "lucide-react";

interface Props { onClose: () => void; onCreated: () => void; }

export function CreateBriefModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({ client_name: "", client_email: "", project_name: "" });
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async () => {
    if (!form.client_name || !form.client_email || !form.project_name) { setError("Tous les champs sont requis"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) { setFieldErrors({ client_email: ["Email invalide"] }); return; }
    setLoading(true); setError(""); setFieldErrors({});
    try {
      const res = await fetch("/api/briefs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, send_email: sendEmail }) });
      if (!res.ok) { const d = await res.json(); if (d.details) setFieldErrors(d.details); setError(d.error || "Erreur"); return; }
      const data = await res.json();
      if (sendEmail && data.emailSent) alert(`Brief créé ! Email envoyé à ${form.client_email}`);
      else if (sendEmail && !data.emailSent) alert("Brief créé ! Email non envoyé (vérifiez Resend). Lien copiable depuis le dashboard.");
      onCreated();
    } catch { setError("Erreur"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ice-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md p-6 sm:p-8 animate-slide-up glass-card-glow rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-ice-100/50 text-txt-muted cursor-pointer"><X className="w-5 h-5" /></button>
        <h2 className="text-[16px] sm:text-[18px] font-semibold mb-1">Nouveau brief</h2>
        <p className="text-txt-muted text-[11px] sm:text-[12px] mb-5 sm:mb-6">Un lien unique sera généré.</p>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nom du client</label>
            <input type="text" className={`input-field ${fieldErrors.client_name ? "!border-red-300" : ""}`} placeholder="Jean Dupont" maxLength={255} value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
            {fieldErrors.client_name && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.client_name[0]}</p>}
          </div>
          <div>
            <label className="label-field">Email du client</label>
            <input type="email" className={`input-field ${fieldErrors.client_email ? "!border-red-300" : ""}`} placeholder="jean@entreprise.fr" maxLength={255} value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} />
            {fieldErrors.client_email && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.client_email[0]}</p>}
          </div>
          <div>
            <label className="label-field">Nom du projet</label>
            <input type="text" className="input-field" placeholder="Site vitrine Boulangerie Martin" maxLength={255} value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl glass-card">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Mail className="w-4 h-4 text-ice-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[12px] font-medium truncate">Envoyer par email</p>
                <p className="text-[10px] sm:text-[11px] text-txt-muted">Le client recevra le lien</p>
              </div>
            </div>
            <button onClick={() => setSendEmail(!sendEmail)} className={`w-12 h-7 rounded-full transition-all cursor-pointer shrink-0 ml-3 ${sendEmail ? "bg-ice-500" : "bg-gray-200"}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-1 ${sendEmail ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-[12px] px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Annuler</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{sendEmail ? "Créer & envoyer" : "Créer"}</span>
            <span className="sm:hidden">Créer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
