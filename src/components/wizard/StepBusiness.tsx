"use client";

import type { BusinessInfo } from "@/lib/types";

interface Props {
  data: BusinessInfo;
  onChange: (key: string, value: string) => void;
}

export function StepBusiness({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">Votre entreprise</h2>
      <p className="text-surface-500 mb-8">
        Parlez-nous de votre activité pour que nous puissions créer un site qui vous ressemble.
      </p>

      <div className="space-y-5">
        <div>
          <label className="label-field">Nom de l&apos;entreprise *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Boulangerie Martin"
            maxLength={255}
            value={data.business_name}
            onChange={(e) => onChange("business_name", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Slogan / Tagline</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Du pain artisanal depuis 1985"
            maxLength={500}
            value={data.tagline}
            onChange={(e) => onChange("tagline", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Description de votre activité *</label>
          <textarea
            className="textarea-field"
            placeholder="Décrivez ce que vous faites, vos spécialités, ce qui vous rend unique..."
            maxLength={2000}
            value={data.activity_description}
            onChange={(e) => onChange("activity_description", e.target.value)}
            rows={4}
          />
          <span className="text-xs text-surface-400 mt-1 block">
            {data.activity_description.length}/2000
          </span>
        </div>

        <div>
          <label className="label-field">Clientèle cible</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Familles du quartier, professionnels, touristes..."
            maxLength={500}
            value={data.target_audience}
            onChange={(e) => onChange("target_audience", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Ce qui vous différencie</label>
          <textarea
            className="textarea-field"
            placeholder="Qu'est-ce qui vous rend unique par rapport à vos concurrents ?"
            maxLength={1000}
            value={data.unique_selling_point}
            onChange={(e) => onChange("unique_selling_point", e.target.value)}
            rows={3}
          />
        </div>

        <div className="h-px bg-surface-200 my-6" />

        <h3 className="font-display font-bold text-lg mb-4">Coordonnées</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Adresse</label>
            <input
              type="text"
              className="input-field"
              placeholder="12 rue du Commerce, 12000 Rodez"
              maxLength={500}
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Téléphone</label>
            <input
              type="tel"
              className="input-field"
              placeholder="06 12 34 56 78"
              maxLength={30}
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Email professionnel</label>
            <input
              type="email"
              className="input-field"
              placeholder="contact@entreprise.fr"
              maxLength={255}
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Horaires d&apos;ouverture</label>
            <input
              type="text"
              className="input-field"
              placeholder="Lun-Ven 9h-18h, Sam 9h-12h"
              maxLength={500}
              value={data.opening_hours}
              onChange={(e) => onChange("opening_hours", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
