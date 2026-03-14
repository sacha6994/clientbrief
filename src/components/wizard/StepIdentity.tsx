"use client";

import { Palette, Sparkles, Gem, Flame, Minimize2, Star, Paintbrush } from "lucide-react";
import type { VisualIdentity } from "@/lib/types";

interface Props { data: VisualIdentity; onChange: (key: string, value: unknown) => void; }

const styles = [
  { key: "modern", label: "Moderne", icon: Sparkles, desc: "Épuré et contemporain" },
  { key: "classic", label: "Classique", icon: Star, desc: "Élégant et intemporel" },
  { key: "bold", label: "Audacieux", icon: Flame, desc: "Impactant et dynamique" },
  { key: "minimal", label: "Minimaliste", icon: Minimize2, desc: "Simple et efficace" },
  { key: "luxury", label: "Luxe", icon: Gem, desc: "Raffiné et premium" },
  { key: "playful", label: "Fun", icon: Paintbrush, desc: "Coloré et décontracté" },
];

export function StepIdentity({ data, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1"><Palette className="w-5 h-5 text-ice-500" /><h2 className="text-[18px] font-semibold">Identité visuelle</h2></div>
      <p className="text-txt-secondary text-[13px] mb-8">L&apos;univers visuel souhaité pour votre site.</p>
      <div className="space-y-8">
        <div>
          <label className="label-field mb-3">Avez-vous un logo ?</label>
          <div className="flex gap-3">
            {[{ val: true, label: "Oui" }, { val: false, label: "Pas encore" }].map(o => (
              <button key={String(o.val)} onClick={() => onChange("has_logo", o.val)}
                className={`flex-1 p-4 rounded-xl text-center transition-all cursor-pointer border ${data.has_logo === o.val ? "bg-ice-50 border-ice-300 text-ice-700 shadow-sm shadow-ice-200/20" : "glass-card !rounded-xl text-txt-secondary"}`}>
                <span className="text-[13px] font-semibold">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-field mb-3">Vos couleurs</label>
          <div className="flex gap-6">
            {[{ key: "primary_color", label: "Principale" }, { key: "secondary_color", label: "Secondaire" }, { key: "accent_color", label: "Accent" }].map(c => (
              <div key={c.key} className="text-center">
                <input type="color" value={data[c.key as keyof VisualIdentity] as string} onChange={e => onChange(c.key, e.target.value)} className="mx-auto block mb-2 cursor-pointer" />
                <span className="text-[11px] text-txt-secondary">{c.label}</span>
                <span className="block text-[11px] font-mono text-txt-muted">{data[c.key as keyof VisualIdentity] as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="label-field mb-3">Style souhaité</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map(s => (
              <button key={s.key} onClick={() => onChange("style_preference", s.key)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer border ${data.style_preference === s.key ? "bg-ice-50 border-ice-300 shadow-sm shadow-ice-200/20" : "glass-card !rounded-xl"}`}>
                <s.icon className={`w-5 h-5 mb-2 ${data.style_preference === s.key ? "text-ice-500" : "text-txt-muted"}`} />
                <span className={`font-semibold text-[13px] block ${data.style_preference === s.key ? "text-ice-700" : "text-txt-secondary"}`}>{s.label}</span>
                <span className="text-[11px] text-txt-muted">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-field mb-1">Sites de référence</label>
          <p className="text-[12px] text-txt-muted mb-3">Sites dont vous aimez le design (optionnel)</p>
          {data.reference_websites.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="url" className="input-field" placeholder="https://exemple.com" value={url} onChange={e => { const u = [...data.reference_websites]; u[i] = e.target.value; onChange("reference_websites", u); }} />
              {i === data.reference_websites.length - 1 && <button onClick={() => onChange("reference_websites", [...data.reference_websites, ""])} className="btn-secondary !px-3 shrink-0">+</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
