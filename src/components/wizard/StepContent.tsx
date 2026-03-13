"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { ContentData } from "@/lib/types";

interface Props {
  data: ContentData;
  businessName: string;
  activity: string;
  onChange: (key: string, value: unknown) => void;
}

export function StepContent({ data, businessName, activity, onChange }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateText = async (field: string, prompt: string) => {
    setGenerating(field);
    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          activity,
          field,
          prompt,
        }),
      });
      const result = await res.json();
      if (result.text) {
        onChange(field, result.text);
      }
    } catch {
      console.error("AI generation failed");
    } finally {
      setGenerating(null);
    }
  };

  const AiButton = ({
    field,
    prompt,
    label,
  }: {
    field: string;
    prompt: string;
    label: string;
  }) => (
    <button
      onClick={() => generateText(field, prompt)}
      disabled={generating === field || (!businessName && !activity)}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 mt-1.5 transition-colors"
    >
      {generating === field ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {generating === field ? "Génération..." : label}
    </button>
  );

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">✍️ Contenus textes</h2>
      <p className="text-surface-500 mb-2">
        Les textes qui apparaîtront sur votre site. Pas d&apos;inspiration ?
      </p>
      <div className="flex items-center gap-2 mb-8 text-sm text-brand-600 bg-brand-50 rounded-lg px-4 py-2.5 border border-brand-100">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>
          Cliquez sur <strong>&quot;Générer avec l&apos;IA&quot;</strong> pour que l&apos;IA rédige un texte
          à partir de vos infos entreprise.
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="label-field">Titre principal (hero)</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Votre boulanger artisan au cœur de Rodez"
            value={data.hero_title}
            onChange={(e) => onChange("hero_title", e.target.value)}
          />
          <AiButton
            field="hero_title"
            prompt="Génère un titre accrocheur court pour la section hero d'un site vitrine"
            label="Générer avec l'IA"
          />
        </div>

        <div>
          <label className="label-field">Sous-titre</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Du pain frais et des viennoiseries maison chaque matin"
            value={data.hero_subtitle}
            onChange={(e) => onChange("hero_subtitle", e.target.value)}
          />
          <AiButton
            field="hero_subtitle"
            prompt="Génère un sous-titre descriptif pour compléter le titre hero"
            label="Générer avec l'IA"
          />
        </div>

        <div>
          <label className="label-field">Texte &quot;À propos&quot;</label>
          <textarea
            className="textarea-field"
            placeholder="Présentez votre histoire, vos valeurs, votre équipe..."
            value={data.about_text}
            onChange={(e) => onChange("about_text", e.target.value)}
            rows={5}
          />
          <AiButton
            field="about_text"
            prompt="Génère un texte 'À propos' de 3-4 phrases, chaleureux et professionnel"
            label="Générer avec l'IA"
          />
        </div>

        <div>
          <label className="label-field">Texte d&apos;appel à l&apos;action (CTA)</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Passez commande en ligne"
            value={data.cta_text}
            onChange={(e) => onChange("cta_text", e.target.value)}
          />
          <AiButton
            field="cta_text"
            prompt="Génère un court appel à l'action (CTA) engageant pour le bouton principal"
            label="Générer avec l'IA"
          />
        </div>
      </div>
    </div>
  );
}
