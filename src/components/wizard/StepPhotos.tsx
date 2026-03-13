"use client";

import { Upload, Image, Users, Camera } from "lucide-react";
import type { PhotoData } from "@/lib/types";

interface Props {
  data: PhotoData;
  onChange: (key: string, value: string[]) => void;
}

const photoSections = [
  {
    key: "logo_files",
    icon: Image,
    title: "Logo",
    desc: "Votre logo en haute résolution (PNG transparent de préférence)",
    placeholder: "https://drive.google.com/... ou lien WeTransfer",
  },
  {
    key: "hero_photos",
    icon: Camera,
    title: "Photo principale (Hero)",
    desc: "La photo d'en-tête de votre site — votre meilleure image",
    placeholder: "Lien vers la photo ou dossier partagé",
  },
  {
    key: "gallery_photos",
    icon: Upload,
    title: "Galerie / Portfolio",
    desc: "Photos de vos réalisations, produits, locaux...",
    placeholder: "Lien vers le dossier Google Drive, Dropbox, WeTransfer...",
  },
  {
    key: "team_photos",
    icon: Users,
    title: "Photos d'équipe",
    desc: "Photos de vous et/ou votre équipe",
    placeholder: "Lien vers les photos",
  },
];

export function StepPhotos({ data, onChange }: Props) {
  const addUrl = (key: string) => {
    const current = data[key as keyof PhotoData] || [];
    onChange(key, [...current, ""]);
  };

  const updateUrl = (key: string, index: number, value: string) => {
    const current = [...(data[key as keyof PhotoData] || [])];
    current[index] = value;
    onChange(key, current);
  };

  const removeUrl = (key: string, index: number) => {
    const current = data[key as keyof PhotoData] || [];
    onChange(
      key,
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">📸 Photos &amp; médias</h2>
      <p className="text-surface-500 mb-3">
        Partagez vos photos via des liens (Google Drive, Dropbox, WeTransfer...).
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-8">
        <strong>💡 Astuce :</strong> Créez un dossier Google Drive ou WeTransfer
        avec toutes vos photos et partagez le lien ici. Plus les photos sont de
        qualité, plus votre site sera beau !
      </div>

      <div className="space-y-8">
        {photoSections.map((section) => {
          const urls = data[section.key as keyof PhotoData] || [];
          return (
            <div key={section.key}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-surface-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold">{section.title}</h3>
                  <p className="text-xs text-surface-500">{section.desc}</p>
                </div>
              </div>

              {urls.length === 0 ? (
                <button
                  onClick={() => addUrl(section.key)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-surface-200 text-surface-400 text-sm hover:border-brand-300 hover:text-brand-600 transition-colors"
                >
                  + Ajouter un lien
                </button>
              ) : (
                <div className="space-y-2">
                  {urls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="url"
                        className="input-field"
                        placeholder={section.placeholder}
                        value={url}
                        onChange={(e) =>
                          updateUrl(section.key, i, e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeUrl(section.key, i)}
                        className="btn-secondary !px-3 shrink-0 text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addUrl(section.key)}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    + Ajouter un autre lien
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
