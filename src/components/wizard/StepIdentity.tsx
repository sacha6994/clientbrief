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
      <div className="flex items-center gap-3 mb-1">
        <Palette className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Identité visuelle</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Aidez-nous à comprendre l&apos;univers visuel souhaité.</p>
      <div className="space-y-8">
        {/* Logo */}
        <div>
          <label className="label-field mb-3">Avez-vous un logo ?</label>
          <div className="flex gap-3">
            {[{ val: true, label: "Oui", icon: "check" }, { val: false, label: "Pas encore", icon: "x" }].map(opt => (
              <button key={String(opt.val)} onClick={() => onChange("has_logo", opt.val)}
                className="flex-1 p-4 rounded-xl text-center transition-all duration-200 cursor-pointer"
                style={data.has_logo === opt.val
                  ? { background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "#06B6D4" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.12)", color: "#94A3B8" }}>
                <span className="text-[13px] font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Colors */}
        <div>
          <label className="label-field mb-3">Vos couleurs</label>
          <p className="text-[12px] text-txt-muted mb-4">Choisissez des couleurs qui vous plaisent.</p>
          <div className="flex gap-6">
            {[{ key: "primary_color", label: "Principale" }, { key: "secondary_color", label: "Secondaire" }, { key: "accent_color", label: "Accent" }].map(c => (
              <div key={c.key} className="text-center">
                <input type="color" value={data[c.key as keyof VisualIdentity] as string} onChange={(e) => onChange(c.key, e.target.value)} className="mx-auto block mb-2 cursor-pointer" />
                <span className="text-[11px] text-txt-secondary">{c.label}</span>
                <span className="block text-[11px] font-mono text-txt-ghost">{data[c.key as keyof VisualIdentity] as string}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Style */}
        <div>
          <label className="label-field mb-3">Style souhaité</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map(s => (
              <button key={s.key} onClick={() => onChange("style_preference", s.key)}
                className="p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
                style={data.style_preference === s.key
                  ? { background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", boxShadow: "0 0 20px rgba(6,182,212,0.08)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.12)" }}>
                <s.icon className="w-5 h-5 mb-2" style={{ color: data.style_preference === s.key ? "#06B6D4" : "#475569" }} />
                <span className="font-semibold text-[13px] block" style={{ color: data.style_preference === s.key ? "#E2E8F0" : "#94A3B8" }}>{s.label}</span>
                <span className="text-[11px] text-txt-muted">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Reference websites */}
        <div>
          <label className="label-field mb-1">Sites de référence</label>
          <p className="text-[12px] text-txt-muted mb-3">Sites dont vous aimez le design (optionnel)</p>
          {data.reference_websites.map((url, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="url" className="input-field" placeholder="https://exemple.com" value={url}
                onChange={(e) => { const u = [...data.reference_websites]; u[i] = e.target.value; onChange("reference_websites", u); }} />
              {i === data.reference_websites.length - 1 && (
                <button onClick={() => onChange("reference_websites", [...data.reference_websites, ""])} className="btn-secondary !px-3 shrink-0 cursor-pointer">+</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
