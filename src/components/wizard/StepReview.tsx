"use client";

import { ListChecks, Building2, Palette, PenTool, Zap, Camera, Link2 } from "lucide-react";
import type { FormData } from "@/app/brief/[token]/page";
import { computeCompletenessScore } from "@/lib/types";

interface Props { formData: FormData; onNotesChange: (notes: string) => void; }

export function StepReview({ formData, onNotesChange }: Props) {
  const { business_info, visual_identity, content, social_links, photos } = formData;
  const { score, details } = computeCompletenessScore(formData);
  const filledServices = content.services.filter(s => s.title);
  const filledTestimonials = content.testimonials.filter(t => t.author);
  const totalPhotos = photos.logo_files.filter(Boolean).length + photos.hero_photos.filter(Boolean).length + photos.gallery_photos.filter(Boolean).length + photos.team_photos.filter(Boolean).length;
  const filledSocials = Object.entries(social_links).filter(([, v]) => v).length;
  const scoreColor = score >= 80 ? "#059669" : score >= 50 ? "#D97706" : "#DC2626";

  return (
    <div>
      <div className="flex items-center gap-3 mb-1"><ListChecks className="w-5 h-5 text-ice-500" /><h2 className="text-[18px] font-semibold">Récapitulatif</h2></div>
      <p className="text-txt-secondary text-[13px] mb-8">Vérifiez avant d&apos;envoyer.</p>
      <div className="space-y-6">
        {/* Score */}
        <div className="p-5 rounded-2xl glass-card-glow">
          <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-[14px]">Complétude</h3><span className="text-[22px] font-bold" style={{ color: scoreColor }}>{score}%</span></div>
          <div className="h-[6px] rounded-full bg-ice-100/60 overflow-hidden mb-3"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: scoreColor }} /></div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">{details.map(d => <div key={d.section} className="text-center"><span className="text-[12px] font-bold block" style={{ color: d.filled === d.total ? "#059669" : "#64748B" }}>{d.filled}/{d.total}</span><span className="text-[10px] text-txt-muted">{d.section}</span></div>)}</div>
          {score < 70 && <p className="text-[11px] text-amber-600 mt-3">Brief incomplet — vous pouvez quand même l&apos;envoyer.</p>}
        </div>

        <div className="p-5 rounded-xl glass-card">
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><Building2 className="w-3.5 h-3.5" /> Entreprise</h3>
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div><span className="text-txt-muted">Nom :</span> <strong>{business_info.business_name || "—"}</strong></div>
            <div><span className="text-txt-muted">Slogan :</span> {business_info.tagline || "—"}</div>
            <div className="col-span-2"><span className="text-txt-muted">Activité :</span> {business_info.activity_description ? (business_info.activity_description.length > 120 ? business_info.activity_description.slice(0, 120) + "..." : business_info.activity_description) : "—"}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card">
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><Palette className="w-3.5 h-3.5" /> Identité</h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-2">{[visual_identity.primary_color, visual_identity.secondary_color, visual_identity.accent_color].map((c, i) => <div key={i} className="w-8 h-8 rounded-lg shadow-sm border border-white/50" style={{ backgroundColor: c }} title={c} />)}</div>
            <span className="text-[12px]">Style : <strong className="capitalize">{visual_identity.style_preference}</strong></span>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card">
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><PenTool className="w-3.5 h-3.5" /> Contenus</h3>
          <div className="space-y-1.5 text-[12px]">
            <div><span className="text-txt-muted">Hero :</span> {content.hero_title || "—"}</div>
            <div><span className="text-txt-muted">À propos :</span> {content.about_text ? "Rempli" : "—"}</div>
            <div><span className="text-txt-muted">CTA :</span> {content.cta_text || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[{ icon: Zap, label: "Services", value: filledServices.length, color: "bg-ice-50 border-ice-200/50 text-ice-600" },
            { icon: ListChecks, label: "Témoignages", value: filledTestimonials.length, color: "bg-emerald-50 border-emerald-200/50 text-emerald-600" },
            { icon: Camera, label: "Photos", value: totalPhotos, color: "bg-violet-50 border-violet-200/50 text-violet-600" }].map(s => (
            <div key={s.label} className={`p-4 rounded-xl text-center border ${s.color}`}><s.icon className="w-4 h-4 mx-auto mb-1" /><span className="text-[18px] font-bold block">{s.value}</span><span className="text-[10px] opacity-70">{s.label}</span></div>
          ))}
        </div>

        <div className="p-4 rounded-xl glass-card text-[12px]"><Link2 className="w-3.5 h-3.5 inline mr-1.5 text-txt-muted" />{filledSocials} réseau{filledSocials > 1 ? "x" : ""} renseigné{filledSocials > 1 ? "s" : ""}</div>

        <div><label className="label-field">Notes supplémentaires (optionnel)</label><textarea className="textarea-field" placeholder="Demandes spéciales, deadline..." rows={3} maxLength={3000} value={formData.additional_notes} onChange={e => onNotesChange(e.target.value)} /></div>
      </div>
    </div>
  );
}
