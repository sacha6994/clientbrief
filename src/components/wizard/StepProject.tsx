"use client";

import { Layout, Globe, Calendar, Wallet, Languages, Users } from "lucide-react";
import type { ProjectScope } from "@/lib/types";

interface Props {
  data: ProjectScope;
  onChange: (key: string, value: unknown) => void;
}

const pageOptions = [
  "Accueil", "À propos", "Services", "Contact", "Galerie / Portfolio",
  "Menu / Carte", "Tarifs", "Blog / Actualités", "FAQ",
  "Réservation", "Témoignages", "Équipe", "Mentions légales",
];

const featureOptions = [
  "Formulaire de contact", "Carte Google Maps intégrée", "Bouton WhatsApp",
  "Réservation en ligne", "Newsletter / inscription email", "Chat en ligne",
  "Galerie photo / carrousel", "Avis Google intégrés", "Bouton appel téléphonique",
  "Lien vers les réseaux sociaux", "Animations au scroll", "Mode sombre",
  "Blog / articles", "Téléchargement de fichiers (PDF menu, brochure...)",
];

const budgetOptions = [
  "Moins de 500€", "500€ — 1 000€", "1 000€ — 2 000€",
  "2 000€ — 5 000€", "Plus de 5 000€", "À discuter",
];

const toneOptions = [
  { key: "formal", label: "Formel", desc: "Vouvoiement, ton professionnel" },
  { key: "friendly", label: "Chaleureux", desc: "Vouvoiement, mais accessible" },
  { key: "casual", label: "Décontracté", desc: "Tutoiement, ton cool" },
];

export function StepProject({ data, onChange }: Props) {
  const togglePage = (page: string) => {
    const current = data.pages_wanted || [];
    onChange("pages_wanted", current.includes(page) ? current.filter(p => p !== page) : [...current, page]);
  };

  const toggleFeature = (feat: string) => {
    const current = data.features || [];
    onChange("features", current.includes(feat) ? current.filter(f => f !== feat) : [...current, feat]);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Layout className="w-5 h-5 text-ice-500" />
        <h2 className="text-[18px] font-semibold">Projet &amp; objectifs</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Décrivez le site que vous imaginez.</p>

      <div className="space-y-8">
        {/* Pages wanted */}
        <div>
          <label className="label-field mb-3">Quelles pages souhaitez-vous ?</label>
          <p className="text-[12px] text-txt-muted mb-3">Sélectionnez toutes les pages dont vous avez besoin.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {pageOptions.map(page => (
              <button key={page} onClick={() => togglePage(page)}
                className={`p-3 rounded-xl text-left text-[12px] font-medium transition-all cursor-pointer border ${
                  (data.pages_wanted || []).includes(page)
                    ? "bg-ice-50 border-ice-300 text-ice-700 shadow-sm"
                    : "glass-card !rounded-xl text-txt-secondary hover:border-ice-200"
                }`}>
                {page}
              </button>
            ))}
          </div>
          {(data.pages_wanted || []).length > 0 && (
            <p className="text-[11px] text-ice-600 mt-2 font-medium">{(data.pages_wanted || []).length} page(s) sélectionnée(s)</p>
          )}
        </div>

        {/* Features */}
        <div>
          <label className="label-field mb-3">Fonctionnalités souhaitées</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {featureOptions.map(feat => (
              <button key={feat} onClick={() => toggleFeature(feat)}
                className={`p-3 rounded-xl text-left text-[12px] font-medium transition-all cursor-pointer border ${
                  (data.features || []).includes(feat)
                    ? "bg-ice-50 border-ice-300 text-ice-700 shadow-sm"
                    : "glass-card !rounded-xl text-txt-secondary hover:border-ice-200"
                }`}>
                {feat}
              </button>
            ))}
          </div>
        </div>

        {/* Domain */}
        <div>
          <label className="label-field mb-3">Nom de domaine</label>
          <div className="flex gap-3 mb-3">
            {[{ val: true, label: "J'en ai déjà un" }, { val: false, label: "Il m'en faut un" }].map(o => (
              <button key={String(o.val)} onClick={() => onChange("has_domain", o.val)}
                className={`flex-1 p-3 rounded-xl text-center text-[12px] font-medium transition-all cursor-pointer border ${
                  data.has_domain === o.val ? "bg-ice-50 border-ice-300 text-ice-700" : "glass-card !rounded-xl text-txt-secondary"
                }`}>{o.label}</button>
            ))}
          </div>
          {data.has_domain && (
            <div>
              <label className="label-field">Votre nom de domaine actuel</label>
              <input type="text" className="input-field" placeholder="Ex: mon-entreprise.fr" maxLength={255} value={data.domain_name} onChange={e => onChange("domain_name", e.target.value)} />
            </div>
          )}
        </div>

        {/* Tone */}
        <div>
          <label className="label-field mb-3">Ton de communication</label>
          <div className="grid grid-cols-3 gap-3">
            {toneOptions.map(t => (
              <button key={t.key} onClick={() => onChange("tone", t.key)}
                className={`p-4 rounded-xl text-center transition-all cursor-pointer border ${
                  data.tone === t.key ? "bg-ice-50 border-ice-300 shadow-sm" : "glass-card !rounded-xl"
                }`}>
                <span className={`font-semibold text-[13px] block mb-1 ${data.tone === t.key ? "text-ice-700" : "text-txt-secondary"}`}>{t.label}</span>
                <span className="text-[11px] text-txt-muted">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="label-field mb-1">Langues du site</label>
          <p className="text-[12px] text-txt-muted mb-3">Séparez par des virgules si multilingue</p>
          <input type="text" className="input-field" placeholder="Ex: Français, Anglais" value={(data.languages || []).join(", ")}
            onChange={e => onChange("languages", e.target.value.split(",").map(l => l.trim()).filter(Boolean))} />
        </div>

        <div className="h-px bg-ice-100/50 my-2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deadline */}
          <div>
            <label className="label-field flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-ice-500" /> Date de livraison souhaitée</label>
            <input type="date" className="input-field" value={data.deadline} onChange={e => onChange("deadline", e.target.value)} />
          </div>

          {/* Budget */}
          <div>
            <label className="label-field flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-ice-500" /> Budget</label>
            <select className="input-field cursor-pointer" value={data.budget} onChange={e => onChange("budget", e.target.value)}>
              <option value="">Sélectionnez</option>
              {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Competitors */}
        <div>
          <label className="label-field flex items-center gap-2"><Users className="w-3.5 h-3.5 text-ice-500" /> Concurrents principaux</label>
          <p className="text-[12px] text-txt-muted mb-3">Sites web ou noms de concurrents (optionnel)</p>
          {(data.competitors || [""]).map((comp, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" className="input-field" placeholder="Ex: boulangerie-dupain.fr" maxLength={255} value={comp}
                onChange={e => { const u = [...(data.competitors || [""])]; u[i] = e.target.value; onChange("competitors", u); }} />
              {i === (data.competitors || [""]).length - 1 && (data.competitors || [""]).length < 5 && (
                <button onClick={() => onChange("competitors", [...(data.competitors || [""]), ""])} className="btn-secondary !px-3 shrink-0">+</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
