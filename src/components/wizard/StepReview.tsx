"use client";

import type { FormData } from "@/app/brief/[token]/page";

interface Props {
  formData: FormData;
}

export function StepReview({ formData }: Props) {
  const { business_info, visual_identity, content, social_links, photos } = formData;

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
      <h2 className="text-2xl font-display font-bold mb-1">✅ Récapitulatif</h2>
      <p className="text-surface-500 mb-8">
        Vérifiez vos informations avant d&apos;envoyer le brief.
      </p>

      <div className="space-y-6">
        {/* Business info */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-200">
          <h3 className="font-display font-bold text-sm text-surface-500 uppercase tracking-wide mb-3">
            🏢 Entreprise
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
                ? business_info.activity_description.slice(0, 120) + "..."
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
            🎨 Identité visuelle
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
            Logo : {visual_identity.has_logo ? "✅ Fourni" : "❌ À créer"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 rounded-xl bg-surface-50 border border-surface-200">
          <h3 className="font-display font-bold text-sm text-surface-500 uppercase tracking-wide mb-3">
            ✍️ Contenus
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
              {content.about_text ? "✅ Rempli" : "—"}
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
              Liens photos
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-500">
          🔗 {filledSocials} réseau{filledSocials > 1 ? "x" : ""} social
          {filledSocials > 1 ? "aux" : ""} renseigné{filledSocials > 1 ? "s" : ""}
        </div>

        {/* Additional notes */}
        <div>
          <label className="label-field">Notes supplémentaires (optionnel)</label>
          <textarea
            className="textarea-field"
            placeholder="Quelque chose à ajouter ? Demandes spéciales, deadline, fonctionnalités souhaitées..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
