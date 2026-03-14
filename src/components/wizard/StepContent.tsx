"use client";

import { useState } from "react";
import { Sparkles, Loader2, PenTool } from "lucide-react";
import type { ContentData } from "@/lib/types";

interface Props { data: ContentData; businessName: string; activity: string; onChange: (key: string, value: unknown) => void; onMagicFill?: () => void; magicFilling?: boolean; }

export function StepContent({ data, businessName, activity, onChange, onMagicFill, magicFilling }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (field: string, prompt: string) => {
    setGenerating(field); setError(null);
    try {
      const res = await fetch("/api/generate-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName, activity, field, prompt }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Échec. Réessayez."); return; }
      const result = await res.json();
      if (result.text) onChange(field, result.text); else setError("Aucun texte généré.");
    } catch { setError("Erreur réseau."); }
    finally { setGenerating(null); }
  };

  const AiBtn = ({ field, prompt }: { field: string; prompt: string }) => (
    <button onClick={() => generateText(field, prompt)} disabled={generating === field || (!businessName && !activity)}
      className="inline-flex items-center gap-1.5 text-[11px] font-medium mt-1.5 transition-all duration-200 cursor-pointer disabled:opacity-40"
      style={{ color: "#8B5CF6" }}>
      {generating === field ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      {generating === field ? "Génération..." : "Générer avec l'IA"}
    </button>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <PenTool className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Contenus textes</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-2">Les textes de votre site. Pas d&apos;inspiration ?</p>

      <div className="flex items-center justify-between gap-3 mb-8 text-[12px] rounded-xl px-4 py-3"
        style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <div className="flex items-center gap-2" style={{ color: "#8B5CF6" }}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>IA disponible par champ ou <strong>tout d&apos;un coup</strong></span>
        </div>
        {onMagicFill && (
          <button onClick={onMagicFill} disabled={magicFilling || (!businessName && !activity)}
            className="btn-primary text-[11px] !py-1.5 !px-3 shrink-0 cursor-pointer"
            style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#8B5CF6", boxShadow: "0 0 15px rgba(139,92,246,0.1)" }}>
            {magicFilling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Tout remplir
          </button>
        )}
      </div>

      {error && <div className="mb-6 px-4 py-3 rounded-xl text-[12px]" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>{error}</div>}

      <div className="space-y-6">
        <div>
          <label className="label-field">Titre principal (hero)</label>
          <input type="text" className="input-field" placeholder="Ex: Votre boulanger artisan au cœur de Rodez" maxLength={500} value={data.hero_title} onChange={(e) => onChange("hero_title", e.target.value)} />
          <AiBtn field="hero_title" prompt="Génère un titre accrocheur court pour la section hero d'un site vitrine" />
        </div>
        <div>
          <label className="label-field">Sous-titre</label>
          <input type="text" className="input-field" placeholder="Ex: Du pain frais chaque matin" maxLength={500} value={data.hero_subtitle} onChange={(e) => onChange("hero_subtitle", e.target.value)} />
          <AiBtn field="hero_subtitle" prompt="Génère un sous-titre descriptif pour compléter le titre hero" />
        </div>
        <div>
          <label className="label-field">Texte &quot;À propos&quot;</label>
          <textarea className="textarea-field" placeholder="Présentez votre histoire, vos valeurs..." maxLength={3000} value={data.about_text} onChange={(e) => onChange("about_text", e.target.value)} rows={5} />
          <AiBtn field="about_text" prompt="Génère un texte 'À propos' de 3-4 phrases, chaleureux et professionnel" />
        </div>
        <div>
          <label className="label-field">Appel à l&apos;action (CTA)</label>
          <input type="text" className="input-field" placeholder="Ex: Passez commande en ligne" maxLength={255} value={data.cta_text} onChange={(e) => onChange("cta_text", e.target.value)} />
          <AiBtn field="cta_text" prompt="Génère un court appel à l'action engageant pour le bouton principal" />
        </div>
      </div>
    </div>
  );
}
