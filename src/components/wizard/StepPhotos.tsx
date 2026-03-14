"use client";

import { Image, Users, Camera, Upload } from "lucide-react";
import type { PhotoData } from "@/lib/types";
import { FileUpload } from "@/components/FileUpload";

interface Props { data: PhotoData; briefId: string; onChange: (key: string, value: string[]) => void; }

const photoSections = [
  { key: "logo_files", icon: Image, title: "Logo", desc: "Haute résolution, PNG transparent de préférence", maxFiles: 3 },
  { key: "hero_photos", icon: Camera, title: "Photo principale (Hero)", desc: "Votre meilleure image d'en-tête", maxFiles: 5 },
  { key: "gallery_photos", icon: Upload, title: "Galerie / Portfolio", desc: "Réalisations, produits, locaux...", maxFiles: 20 },
  { key: "team_photos", icon: Users, title: "Photos d'équipe", desc: "Vous et/ou votre équipe", maxFiles: 10 },
];

export function StepPhotos({ data, briefId, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Camera className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Photos &amp; médias</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-3">Uploadez vos photos ou partagez des liens.</p>
      <div className="rounded-xl px-4 py-3 text-[12px] mb-8" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", color: "#F59E0B" }}>
        <strong>Astuce :</strong> Glissez-déposez vos fichiers. Formats : JPG, PNG, WebP, SVG, PDF. Max 10 Mo/fichier.
      </div>
      <div className="space-y-8">
        {photoSections.map(section => (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
                <section.icon className="w-5 h-5 text-txt-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-[13px] text-txt-primary">{section.title}</h3>
                <p className="text-[11px] text-txt-muted">{section.desc}</p>
              </div>
            </div>
            <FileUpload briefId={briefId} category={section.key} existingUrls={data[section.key as keyof PhotoData] || []} onUrlsChange={(urls) => onChange(section.key, urls)} maxFiles={section.maxFiles} />
          </div>
        ))}
      </div>
    </div>
  );
}
