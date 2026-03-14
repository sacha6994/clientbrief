"use client";

import { useState } from "react";
import { Sparkles, Loader2, PenTool } from "lucide-react";
import type { ContentData } from "@/lib/types";

interface Props { data: ContentData; businessName: string; activity: string; onChange: (key: string, value: unknown) => void; onMagicFill?: () => void; magicFilling?: boolean; }

export function StepContent({ data, businessName, activity, onChange, onMagicFill, magicFilling }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gen = async (field: string, prompt: string) => { setGenerating(field); setError(null); try { const r = await fetch("/api/generate-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName, activity, field, prompt }) }); if (!r.ok) { setError("Échec. Réessayez."); return; } const d = await r.json(); if (d.text) onChange(field, d.text); else setError("Aucun texte généré."); } catch { setError("Erreur réseau."); } finally { setGenerating(null); } };

  const AiBtn = ({ field, prompt }: { field: string; prompt: string }) => (
    <button onClick={() => gen(field, prompt)} disabled={generating === field || (!businessName && !activity)} className="inline-flex items-center gap-1.5 text-[11px] font-medium mt-1.5 text-violet-500 hover:text-violet-600 transition-colors cursor-pointer disabled:opacity-40">
      {generating === field ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}{generating === field ? "Génération..." : "Générer avec l'IA"}
    </button>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-1"><PenTool className="w-5 h-5 text-ice-500" /><h2 className="text-[18px] font-semibold">Contenus textes</h2></div>
      <p className="text-txt-secondary text-[13px] mb-2">Les textes de votre site.</p>
      <div className="flex items-center justify-between gap-3 mb-8 text-[12px] rounded-xl px-4 py-3 bg-violet-50 border border-violet-200/50">
        <div className="flex items-center gap-2 text-violet-600"><Sparkles className="w-4 h-4 shrink-0" /><span>IA par champ ou <strong>tout d&apos;un coup</strong></span></div>
        {onMagicFill && <button onClick={onMagicFill} disabled={magicFilling || (!businessName && !activity)} className="btn-primary text-[11px] !py-1.5 !px-3 shrink-0 !bg-gradient-to-r !from-violet-400 !to-violet-600 !border-violet-400/30 !shadow-violet-400/15">{magicFilling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}Tout remplir</button>}
      </div>
      {error && <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-600">{error}</div>}
      <div className="space-y-6">
        <div><label className="label-field">Titre principal (hero)</label><input type="text" className="input-field" placeholder="Ex: Votre boulanger artisan" maxLength={500} value={data.hero_title} onChange={e => onChange("hero_title", e.target.value)} /><AiBtn field="hero_title" prompt="Génère un titre accrocheur court pour la section hero" /></div>
        <div><label className="label-field">Sous-titre</label><input type="text" className="input-field" placeholder="Ex: Du pain frais chaque matin" maxLength={500} value={data.hero_subtitle} onChange={e => onChange("hero_subtitle", e.target.value)} /><AiBtn field="hero_subtitle" prompt="Génère un sous-titre descriptif" /></div>
        <div><label className="label-field">Texte &quot;À propos&quot;</label><textarea className="textarea-field" placeholder="Votre histoire, vos valeurs..." maxLength={3000} value={data.about_text} onChange={e => onChange("about_text", e.target.value)} rows={5} /><AiBtn field="about_text" prompt="Génère un texte 'À propos' chaleureux et professionnel" /></div>
        <div><label className="label-field">Appel à l&apos;action (CTA)</label><input type="text" className="input-field" placeholder="Ex: Passez commande en ligne" maxLength={255} value={data.cta_text} onChange={e => onChange("cta_text", e.target.value)} /><AiBtn field="cta_text" prompt="Génère un court appel à l'action engageant" /></div>
      </div>
    </div>
  );
}
