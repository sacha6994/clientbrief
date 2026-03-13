"use client";

import type { SocialLinks } from "@/lib/types";

interface Props {
  data: SocialLinks;
  onChange: (key: string, value: string) => void;
}

const socials = [
  {
    key: "facebook",
    label: "Facebook",
    icon: "📘",
    placeholder: "https://facebook.com/votre-page",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "📷",
    placeholder: "https://instagram.com/votre-compte",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: "🎵",
    placeholder: "https://tiktok.com/@votre-compte",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    placeholder: "https://linkedin.com/in/votre-profil",
  },
  {
    key: "google_maps",
    label: "Google Maps / Fiche Google",
    icon: "📍",
    placeholder: "Lien de votre fiche Google Business",
  },
  {
    key: "website_current",
    label: "Site web actuel (s'il existe)",
    icon: "🌐",
    placeholder: "https://votre-site-actuel.fr",
  },
];

export function StepSocial({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">🔗 Réseaux sociaux</h2>
      <p className="text-surface-500 mb-8">
        Renseignez vos comptes pour qu&apos;on puisse les intégrer à votre site.
        Remplissez uniquement ceux que vous utilisez.
      </p>

      <div className="space-y-4">
        {socials.map((s) => (
          <div key={s.key} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center shrink-0 text-lg">
              {s.icon}
            </div>
            <div className="flex-1">
              <label className="label-field !mb-1">{s.label}</label>
              <input
                type="url"
                className="input-field"
                placeholder={s.placeholder}
                value={data[s.key as keyof SocialLinks]}
                onChange={(e) => onChange(s.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
