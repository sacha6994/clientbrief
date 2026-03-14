"use client";

import { Link2, Facebook, Instagram, Linkedin, Globe, MapPin, Music } from "lucide-react";
import type { SocialLinks } from "@/lib/types";

interface Props { data: SocialLinks; onChange: (key: string, value: string) => void; }

const socials = [
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/votre-page" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/votre-compte" },
  { key: "tiktok", label: "TikTok", icon: Music, placeholder: "https://tiktok.com/@votre-compte" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/votre-profil" },
  { key: "google_maps", label: "Google Maps", icon: MapPin, placeholder: "Lien de votre fiche Google Business" },
  { key: "website_current", label: "Site actuel", icon: Globe, placeholder: "https://votre-site-actuel.fr" },
];

export function StepSocial({ data, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Link2 className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Réseaux sociaux</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Remplissez uniquement ceux que vous utilisez.</p>
      <div className="space-y-4">
        {socials.map(s => (
          <div key={s.key} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
              <s.icon className="w-5 h-5 text-txt-secondary" />
            </div>
            <div className="flex-1">
              <label className="label-field !mb-1">{s.label}</label>
              <input type="url" className="input-field" placeholder={s.placeholder} value={data[s.key as keyof SocialLinks]} onChange={(e) => onChange(s.key, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
