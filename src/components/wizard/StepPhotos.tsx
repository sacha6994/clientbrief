"use client";

import { Image, Users, Camera, Upload } from "lucide-react";
import type { PhotoData } from "@/lib/types";
import { FileUpload } from "@/components/FileUpload";

interface Props {
  data: PhotoData;
  briefId: string;
  onChange: (key: string, value: string[]) => void;
}

const photoSections = [
  {
    key: "logo_files",
    icon: Image,
    title: "Logo",
    desc: "Votre logo en haute résolution (PNG transparent de préférence)",
    maxFiles: 3,
  },
  {
    key: "hero_photos",
    icon: Camera,
    title: "Photo principale (Hero)",
    desc: "La photo d'en-tête de votre site — votre meilleure image",
    maxFiles: 5,
  },
  {
    key: "gallery_photos",
    icon: Upload,
    title: "Galerie / Portfolio",
    desc: "Photos de vos réalisations, produits, locaux...",
    maxFiles: 20,
  },
  {
    key: "team_photos",
    icon: Users,
    title: "Photos d'équipe",
    desc: "Photos de vous et/ou votre équipe",
    maxFiles: 10,
  },
];

export function StepPhotos({ data, briefId, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">Photos &amp; médias</h2>
      <p className="text-surface-500 mb-3">
        Uploadez vos photos directement ou partagez des liens.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-8">
        <strong>Astuce :</strong> Glissez-déposez vos fichiers directement dans les zones ci-dessous.
        Formats acceptés : JPG, PNG, WebP, SVG, PDF. Max 10 Mo par fichier.
      </div>

      <div className="space-y-8">
        {photoSections.map((section) => {
          const urls = data[section.key as keyof PhotoData] || [];
          return (
            <div key={section.key}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-surface-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold">{section.title}</h3>
                  <p className="text-xs text-surface-500">{section.desc}</p>
                </div>
              </div>

              <FileUpload
                briefId={briefId}
                category={section.key}
                existingUrls={urls}
                onUrlsChange={(newUrls) => onChange(section.key, newUrls)}
                maxFiles={section.maxFiles}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
