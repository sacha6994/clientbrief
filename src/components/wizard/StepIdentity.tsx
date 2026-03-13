"use client";

import type { VisualIdentity } from "@/lib/types";

interface Props {
  data: VisualIdentity;
  onChange: (key: string, value: unknown) => void;
}

const styles = [
  { key: "modern", label: "Moderne", emoji: "✨", desc: "Épuré et contemporain" },
  { key: "classic", label: "Classique", emoji: "🏛️", desc: "Élégant et intemporel" },
  { key: "bold", label: "Audacieux", emoji: "🔥", desc: "Impactant et dynamique" },
  { key: "minimal", label: "Minimaliste", emoji: "◻️", desc: "Simple et efficace" },
  { key: "luxury", label: "Luxe", emoji: "💎", desc: "Raffiné et premium" },
  { key: "playful", label: "Fun", emoji: "🎨", desc: "Coloré et décontracté" },
];

export function StepIdentity({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">🎨 Identité visuelle</h2>
      <p className="text-surface-500 mb-8">
        Aidez-nous à comprendre l&apos;univers visuel que vous souhaitez pour votre site.
      </p>

      <div className="space-y-8">
        {/* Logo */}
        <div>
          <label className="label-field mb-3">Avez-vous un logo ?</label>
          <div className="flex gap-3">
            <button
              onClick={() => onChange("has_logo", true)}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                data.has_logo
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-surface-200 hover:border-surface-300"
              }`}
            >
              <span className="block text-2xl mb-1">✅</span>
              <span className="text-sm font-semibold">Oui, j&apos;en ai un</span>
            </button>
            <button
              onClick={() => onChange("has_logo", false)}
              className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                !data.has_logo
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-surface-200 hover:border-surface-300"
              }`}
            >
              <span className="block text-2xl mb-1">❌</span>
              <span className="text-sm font-semibold">Pas encore</span>
            </button>
          </div>
          {data.has_logo && (
            <div className="mt-4">
              <p className="text-sm text-surface-500 mb-2">
                Vous pourrez uploader votre logo dans l&apos;étape &quot;Photos &amp; médias&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Colors */}
        <div>
          <label className="label-field mb-3">Vos couleurs</label>
          <p className="text-sm text-surface-500 mb-4">
            Si vous n&apos;avez pas de charte graphique, choisissez des couleurs qui vous plaisent.
          </p>
          <div className="flex gap-6">
            {[
              { key: "primary_color", label: "Principale" },
              { key: "secondary_color", label: "Secondaire" },
              { key: "accent_color", label: "Accent" },
            ].map((c) => (
              <div key={c.key} className="text-center">
                <input
                  type="color"
                  value={data[c.key as keyof VisualIdentity] as string}
                  onChange={(e) => onChange(c.key, e.target.value)}
                  className="mx-auto block mb-2 cursor-pointer"
                />
                <span className="text-xs text-surface-500">{c.label}</span>
                <span className="block text-xs font-mono text-surface-400">
                  {data[c.key as keyof VisualIdentity] as string}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="label-field mb-3">Style souhaité</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map((s) => (
              <button
                key={s.key}
                onClick={() => onChange("style_preference", s.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.style_preference === s.key
                    ? "border-brand-500 bg-brand-50"
                    : "border-surface-200 hover:border-surface-300"
                }`}
              >
                <span className="text-2xl block mb-1">{s.emoji}</span>
                <span className="font-display font-bold text-sm block">
                  {s.label}
                </span>
                <span className="text-xs text-surface-500">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reference websites */}
        <div>
          <label className="label-field mb-1">Sites de référence</label>
          <p className="text-sm text-surface-500 mb-3">
            Des sites web dont vous aimez le design ? (optionnel)
          </p>
          {data.reference_websites.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="url"
                className="input-field"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => {
                  const updated = [...data.reference_websites];
                  updated[i] = e.target.value;
                  onChange("reference_websites", updated);
                }}
              />
              {i === data.reference_websites.length - 1 && (
                <button
                  onClick={() =>
                    onChange("reference_websites", [
                      ...data.reference_websites,
                      "",
                    ])
                  }
                  className="btn-secondary !px-3 shrink-0"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
