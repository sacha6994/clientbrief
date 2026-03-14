"use client";

import type { FormData } from "@/app/brief/[token]/page";
import { computeCompletenessScore } from "@/lib/types";

interface Props {
  formData: FormData;
  onNotesChange: (notes: string) => void;
}

export function StepReview({ formData, onNotesChange }: Props) {
  const { business_info, visual_identity, content, social_links, photos } = formData;
  const { score, details } = computeCompletenessScore(formData);

  const filledServices = content.services.filter((s) => s.title);
  const filledTestimonials = content.testimonials.filter((t) => t.author);
  const totalPhotos =
    photos.logo_files.filter(Boolean).length +
    photos.hero_photos.filter(Boolean).length +
    photos.gallery_photos.filter(Boolean).length +
    photos.team_photos.filter(Boolean).length;

  const filledSocials = Object.entries(social_links).filter(
    ([, v]) => v
  ).length;

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">Récapitulatif</h2>
      <p className="text-surface-500 mb-8">
        Vérifiez vos informations avant d&apos;envoyer le brief.
      </p>

      <div className="space-y-6">
        {/* Completeness score */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Score de complétude</h3>
            <span className={`text-2xl font-display font-bold ${
              score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500"
            }`}>
              {score}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/80 overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-400"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {details.map((d) => (
              <div key={d.section} className="text-center">
                <span className={`text-sm font-bold block ${
                  d.filled === d.total ? "text-emerald-600" : "text-surface-500"
                }`}>
                  {d.filled}/{d.total}
                </span>
                <span className="text-[10px] text-surface-400">{d.section}</span>
              </div>
            ))}
          </div>
          {score < 70 && (
            <p className="text-xs text-amber-700 mt-3">
              Votre brief est incomplet. Vous pouvez quand même l&apos;envoyer, mais nous vous recommandons de remplir les sections manquantes.
            </p>
          )}
        </div>

        {/* Business info */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-200">
          <h3 className="font-display font-bold text-sm text-surface-500 uppercase tracking-wide mb-3">
            Entreprise
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-surface-500">Nom :</span>{" "}
              <strong>{business_info.business_name || "—"}</strong>
            </div>
            <div>
              <span className="text-surface-500">Slogan :</span>{" "}
              {business_info.tagline || "—"}
            </div>
            <div className="col-span-2">
              <span className="text-surface-500">Activité :</span>{" "}
              {business_info.activity_description
                ? business_info.activity_description.length > 120
                  ? business_info.activity_description.slice(0, 120) + "..."
                  : business_info.activity_description
                : "—"}
            </div>
            <div>
              <span className="text-surface-500">Tél :</span>{" "}
              {business_info.phone || "—"}
            </div>
            <div>
              <span className="text-surface-500">Email :</span>{" "}
              {business_info.email || "—"}
            </div>
          </div>
        </div>

        {/* Visual identity */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-200">
          <h3 className="font-display font-bold text-sm text-surface-500 uppercase tracking-wide mb-3">
            Identité visuelle
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex gap-2">
              {[
                visual_identity.primary_color,
                visual_identity.secondary_color,
                visual_identity.accent_color,
              ].map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg border border-surface-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <span className="text-sm">
              Style :{" "}
              <strong className="capitalize">
                {visual_identity.style_preference}
              </strong>
            </span>
          </div>
          <div className="text-sm text-surface-500">
            Logo : {visual_identity.has_logo ? "Fourni" : "À créer"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-200">
          <h3 className="font-display font-bold text-sm text-surface-500 uppercase tracking-wide mb-3">
            Contenus
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-surface-500">Titre hero :</span>{" "}
              {content.hero_title || "—"}
            </div>
            <div>
              <span className="text-surface-500">Sous-titre :</span>{" "}
              {content.hero_subtitle || "—"}
            </div>
            <div>
              <span className="text-surface-500">À propos :</span>{" "}
              {content.about_text ? "Rempli" : "—"}
            </div>
            <div>
              <span className="text-surface-500">CTA :</span>{" "}
              {content.cta_text || "—"}
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-center">
            <span className="text-2xl font-bold text-brand-700">
              {filledServices.length}
            </span>
            <span className="block text-xs text-brand-600 mt-1">Services</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-2xl font-bold text-emerald-700">
              {filledTestimonials.length}
            </span>
            <span className="block text-xs text-emerald-600 mt-1">
              Témoignages
            </span>
          </div>
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 text-center">
            <span className="text-2xl font-bold text-violet-700">
              {totalPhotos}
            </span>
            <span className="block text-xs text-violet-600 mt-1">
              Photos
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-500">
          {filledSocials} réseau{filledSocials > 1 ? "x" : ""} social
          {filledSocials > 1 ? "aux" : ""} renseigné{filledSocials > 1 ? "s" : ""}
        </div>

        {/* Additional notes */}
        <div>
          <label className="label-field">Notes supplémentaires (optionnel)</label>
          <textarea
            className="textarea-field"
            placeholder="Quelque chose à ajouter ? Demandes spéciales, deadline, fonctionnalités souhaitées..."
            rows={3}
            maxLength={3000}
            value={formData.additional_notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
