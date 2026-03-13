"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateBriefModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    project_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.client_name || !form.client_email || !form.project_name) {
      setError("Tous les champs sont requis");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      onCreated();
    } catch {
      setError("Erreur lors de la création du brief");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-100 text-surface-400"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-display font-bold mb-1">Nouveau brief</h2>
        <p className="text-surface-500 text-sm mb-6">
          Un lien unique sera généré pour votre client.
        </p>

        <div className="space-y-4">
          <div>
            <label className="label-field">Nom du client</label>
            <input
              type="text"
              className="input-field"
              placeholder="Jean Dupont"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Email du client</label>
            <input
              type="email"
              className="input-field"
              placeholder="jean@entreprise.fr"
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Nom du projet</label>
            <input
              type="text"
              className="input-field"
              placeholder="Site vitrine Boulangerie Martin"
              value={form.project_name}
              onChange={(e) => setForm({ ...form, project_name: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Créer le brief"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
