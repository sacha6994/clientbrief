"use client";

import { Plus, Trash2, Zap, Star } from "lucide-react";
import type { ContentData } from "@/lib/types";

interface Props { data: ContentData; onChange: (key: string, value: unknown) => void; }

export function StepServices({ data, onChange }: Props) {
  const addService = () => { if (data.services.length >= 20) return; onChange("services", [...data.services, { id: String(data.services.length + 1), title: "", description: "", price: "" }]); };
  const updateService = (i: number, f: string, v: string) => { const u = [...data.services]; u[i] = { ...u[i], [f]: v }; onChange("services", u); };
  const removeService = (i: number) => { if (data.services.length <= 1) return; onChange("services", data.services.filter((_, idx) => idx !== i)); };
  const addTestimonial = () => { if (data.testimonials.length >= 20) return; onChange("testimonials", [...data.testimonials, { id: String(data.testimonials.length + 1), author: "", text: "", rating: 5 }]); };
  const updateTestimonial = (i: number, f: string, v: unknown) => { const u = [...data.testimonials]; u[i] = { ...u[i], [f]: v }; onChange("testimonials", u); };
  const removeTestimonial = (i: number) => { if (data.testimonials.length <= 1) return; onChange("testimonials", data.testimonials.filter((_, idx) => idx !== i)); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Zap className="w-5 h-5 text-cyan" />
        <h2 className="text-[18px] font-semibold text-txt-primary">Services &amp; Avis</h2>
      </div>
      <p className="text-txt-secondary text-[13px] mb-8">Vos prestations et témoignages clients.</p>

      <div className="mb-10">
        <h3 className="font-semibold text-[14px] text-txt-primary mb-4">Vos services</h3>
        <div className="space-y-4">
          {data.services.map((s, i) => (
            <div key={s.id} className="p-5 rounded-xl relative group" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
              {data.services.length > 1 && (
                <button onClick={() => removeService(i)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer" style={{ color: "#EF4444" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2"><label className="label-field">Nom du service</label><input type="text" className="input-field" placeholder="Ex: Coupe homme" maxLength={255} value={s.title} onChange={(e) => updateService(i, "title", e.target.value)} /></div>
                <div><label className="label-field">Prix (optionnel)</label><input type="text" className="input-field" placeholder="Ex: 25€" maxLength={50} value={s.price || ""} onChange={(e) => updateService(i, "price", e.target.value)} /></div>
              </div>
              <div className="mt-3"><label className="label-field">Description</label><textarea className="textarea-field !min-h-[70px]" placeholder="Décrivez brièvement..." maxLength={1000} value={s.description} onChange={(e) => updateService(i, "description", e.target.value)} rows={2} /></div>
            </div>
          ))}
        </div>
        {data.services.length < 20 && <button onClick={addService} className="btn-secondary mt-4 cursor-pointer"><Plus className="w-4 h-4" /> Ajouter un service</button>}
      </div>

      <div>
        <h3 className="font-semibold text-[14px] text-txt-primary mb-4">Témoignages clients</h3>
        <p className="text-[12px] text-txt-muted mb-4">Avis de clients satisfaits à afficher sur le site.</p>
        <div className="space-y-4">
          {data.testimonials.map((t, i) => (
            <div key={t.id} className="p-5 rounded-xl relative group" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}>
              {data.testimonials.length > 1 && (
                <button onClick={() => removeTestimonial(i)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer" style={{ color: "#EF4444" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div><label className="label-field">Nom</label><input type="text" className="input-field" placeholder="Ex: Marie D." maxLength={255} value={t.author} onChange={(e) => updateTestimonial(i, "author", e.target.value)} /></div>
                <div>
                  <label className="label-field">Note</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => updateTestimonial(i, "rating", star)} className="transition-transform hover:scale-110 cursor-pointer">
                        <Star className="w-5 h-5" style={{ color: star <= t.rating ? "#F59E0B" : "#334155", fill: star <= t.rating ? "#F59E0B" : "none" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div><label className="label-field">Avis</label><textarea className="textarea-field !min-h-[70px]" placeholder="Ce que le client a dit..." maxLength={1000} value={t.text} onChange={(e) => updateTestimonial(i, "text", e.target.value)} rows={2} /></div>
            </div>
          ))}
        </div>
        {data.testimonials.length < 20 && <button onClick={addTestimonial} className="btn-secondary mt-4 cursor-pointer"><Plus className="w-4 h-4" /> Ajouter un témoignage</button>}
      </div>
    </div>
  );
}
