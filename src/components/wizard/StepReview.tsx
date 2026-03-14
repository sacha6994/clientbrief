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

  const scoreColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <ListChecks className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Récapitulatif</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Vérifiez vos informations avant d&apos;envoyer.</p>

      <div className="space-y-6">
        {/* Score */}
        <div className="p-5 rounded-2xl glass-card-glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[14px] text-txt-primary">Complétude</h3>
            <span className="text-[22px] font-bold" style={{ color: scoreColor }}>{score}%</span>
          </div>
          <div className="h-[6px] rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, boxShadow: `0 0 8px ${scoreColor}66` }} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {details.map(d => (
              <div key={d.section} className="text-center">
                <span className="text-[12px] font-bold block" style={{ color: d.filled === d.total ? "#10B981" : "#94A3B8" }}>{d.filled}/{d.total}</span>
                <span className="text-[10px] text-txt-ghost">{d.section}</span>
              </div>
            ))}
          </div>
          {score < 70 && <p className="text-[11px] mt-3" style={{ color: "#F59E0B" }}>Brief incomplet. Vous pouvez quand même l&apos;envoyer.</p>}
        </div>

        {/* Business */}
        <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><Building2 className="w-3.5 h-3.5" /> Entreprise</h3>
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div><span className="text-txt-muted">Nom :</span> <strong className="text-txt-primary">{business_info.business_name || "—"}</strong></div>
            <div><span className="text-txt-muted">Slogan :</span> <span className="text-txt-secondary">{business_info.tagline || "—"}</span></div>
            <div className="col-span-2"><span className="text-txt-muted">Activité :</span> <span className="text-txt-secondary">{business_info.activity_description ? (business_info.activity_description.length > 120 ? business_info.activity_description.slice(0, 120) + "..." : business_info.activity_description) : "—"}</span></div>
          </div>
        </div>

        {/* Identity */}
        <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><Palette className="w-3.5 h-3.5" /> Identité</h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-2">
              {[visual_identity.primary_color, visual_identity.secondary_color, visual_identity.accent_color].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-lg" style={{ backgroundColor: c, border: "1px solid rgba(255,255,255,0.1)", boxShadow: `0 0 10px ${c}44` }} title={c} />
              ))}
            </div>
            <span className="text-[12px] text-txt-secondary">Style : <strong className="text-txt-primary capitalize">{visual_identity.style_preference}</strong></span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 className="flex items-center gap-2 text-[12px] font-semibold text-txt-muted uppercase tracking-wide mb-3"><PenTool className="w-3.5 h-3.5" /> Contenus</h3>
          <div className="space-y-1.5 text-[12px]">
            <div><span className="text-txt-muted">Hero :</span> <span className="text-txt-secondary">{content.hero_title || "—"}</span></div>
            <div><span className="text-txt-muted">À propos :</span> <span className="text-txt-secondary">{content.about_text ? "Rempli" : "—"}</span></div>
            <div><span className="text-txt-muted">CTA :</span> <span className="text-txt-secondary">{content.cta_text || "—"}</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap, label: "Services", value: filledServices.length, color: "#06B6D4" },
            { icon: ListChecks, label: "Témoignages", value: filledTestimonials.length, color: "#10B981" },
            { icon: Camera, label: "Photos", value: totalPhotos, color: "#8B5CF6" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
              <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
              <span className="text-[18px] font-bold block" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] text-txt-muted">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl text-[12px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
          <Link2 className="w-3.5 h-3.5 inline mr-1.5 text-txt-muted" />
          <span className="text-txt-secondary">{filledSocials} réseau{filledSocials > 1 ? "x" : ""} renseigné{filledSocials > 1 ? "s" : ""}</span>
        </div>

        <div>
          <label className="label-field">Notes supplémentaires (optionnel)</label>
          <textarea className="textarea-field" placeholder="Demandes spéciales, deadline, fonctionnalités..." rows={3} maxLength={3000} value={formData.additional_notes} onChange={(e) => onNotesChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
