"use client";

import { Search, Shield, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import type { SeoLegal } from "@/lib/types";

interface Props {
  data: SeoLegal;
  businessName: string;
  activity: string;
  onChange: (key: string, value: string) => void;
}

export function StepSeo({ data, businessName, activity, onChange }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateField = async (field: string, prompt: string) => {
    setGenerating(field);
    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, activity, field, prompt }),
      });
      if (res.ok) {
        const { text } = await res.json();
        if (text) onChange(field, text);
      }
    } catch {}
    finally { setGenerating(null); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Search className="w-5 h-5 text-ice-500" />
        <h2 className="text-[18px] font-semibold">SEO &amp; informations légales</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Pour le référencement Google et les obligations légales.</p>

      <div className="space-y-8">
        {/* SEO Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-ice-500" />
            <h3 className="font-semibold text-[14px]">Référencement (SEO)</h3>
          </div>

          <div className="rounded-xl px-4 py-3 text-[12px] mb-6 bg-ice-50 border border-ice-200/50 text-ice-700">
            Ces informations aident votre site à apparaître dans les résultats Google.
          </div>

          <div className="space-y-5">
            <div>
              <label className="label-field">Mots-clés principaux</label>
              <p className="text-[11px] text-txt-muted mb-2">Sur quels termes vos clients vous cherchent-ils sur Google ?</p>
              <textarea
                className="textarea-field !min-h-[80px]"
                placeholder="Ex: boulangerie artisanale Rodez, pain bio Aveyron, viennoiseries maison..."
                maxLength={500}
                value={data.keywords}
                onChange={e => onChange("keywords", e.target.value)}
                rows={3}
              />
              <button
                onClick={() => generateField("keywords", "Génère 5-8 mots-clés SEO pertinents séparés par des virgules pour ce type d'entreprise")}
                disabled={generating === "keywords" || (!businessName && !activity)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium mt-1.5 text-violet-500 hover:text-violet-600 transition-colors cursor-pointer disabled:opacity-40">
                {generating === "keywords" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {generating === "keywords" ? "Génération..." : "Suggérer avec l'IA"}
              </button>
            </div>

            <div>
              <label className="label-field">Meta description</label>
              <p className="text-[11px] text-txt-muted mb-2">Le texte qui apparaît sous votre site dans Google (max 160 caractères)</p>
              <textarea
                className="textarea-field !min-h-[70px]"
                placeholder="Ex: Boulangerie artisanale à Rodez. Pain au levain, viennoiseries maison et pâtisseries. Ouvert du lundi au samedi."
                maxLength={160}
                value={data.meta_description}
                onChange={e => onChange("meta_description", e.target.value)}
                rows={2}
              />
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={() => generateField("meta_description", "Génère une meta description SEO de 150 caractères max pour ce site vitrine")}
                  disabled={generating === "meta_description" || (!businessName && !activity)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-violet-500 hover:text-violet-600 transition-colors cursor-pointer disabled:opacity-40">
                  {generating === "meta_description" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Suggérer avec l&apos;IA
                </button>
                <span className={`text-[11px] ${(data.meta_description?.length || 0) > 155 ? "text-amber-500" : "text-txt-ghost"}`}>
                  {data.meta_description?.length || 0}/160
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-ice-100/50" />

        {/* Legal Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-ice-500" />
            <h3 className="font-semibold text-[14px]">Informations légales</h3>
          </div>

          <div className="rounded-xl px-4 py-3 text-[12px] mb-6 bg-amber-50 border border-amber-200/50 text-amber-700">
            Obligatoires sur tout site web professionnel en France. Remplissez ce que vous pouvez.
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Numéro SIRET</label>
                <input type="text" className="input-field" placeholder="Ex: 123 456 789 00012" maxLength={20} value={data.siret} onChange={e => onChange("siret", e.target.value)} />
              </div>
              <div>
                <label className="label-field">Statut juridique</label>
                <select className="input-field cursor-pointer" value={data.legal_status} onChange={e => onChange("legal_status", e.target.value)}>
                  <option value="">Sélectionnez</option>
                  <option value="auto-entrepreneur">Auto-entrepreneur</option>
                  <option value="eurl">EURL</option>
                  <option value="sarl">SARL</option>
                  <option value="sas">SAS</option>
                  <option value="sasu">SASU</option>
                  <option value="association">Association</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label-field">Nom du responsable de publication</label>
              <input type="text" className="input-field" placeholder="Ex: Jean Dupont" maxLength={255} value={data.legal_name} onChange={e => onChange("legal_name", e.target.value)} />
            </div>

            <div>
              <label className="label-field">Email de contact pour la politique de confidentialité</label>
              <input type="email" className="input-field" placeholder="Ex: rgpd@entreprise.fr" maxLength={255} value={data.privacy_contact} onChange={e => onChange("privacy_contact", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
