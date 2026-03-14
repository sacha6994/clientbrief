"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ContentData } from "@/lib/types";

interface Props {
  data: ContentData;
  onChange: (key: string, value: unknown) => void;
}

export function StepServices({ data, onChange }: Props) {
  const addService = () => {
    if (data.services.length >= 20) return;
    const newId = String(data.services.length + 1);
    onChange("services", [
      ...data.services,
      { id: newId, title: "", description: "", price: "" },
    ]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...data.services];
    updated[index] = { ...updated[index], [field]: value };
    onChange("services", updated);
  };

  const removeService = (index: number) => {
    if (data.services.length <= 1) return;
    onChange(
      "services",
      data.services.filter((_, i) => i !== index)
    );
  };

  const addTestimonial = () => {
    if (data.testimonials.length >= 20) return;
    const newId = String(data.testimonials.length + 1);
    onChange("testimonials", [
      ...data.testimonials,
      { id: newId, author: "", text: "", rating: 5 },
    ]);
  };

  const updateTestimonial = (index: number, field: string, value: unknown) => {
    const updated = [...data.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    onChange("testimonials", updated);
  };

  const removeTestimonial = (index: number) => {
    if (data.testimonials.length <= 1) return;
    onChange(
      "testimonials",
      data.testimonials.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-1">Services &amp; Avis</h2>
      <p className="text-surface-500 mb-8">
        Listez vos services/prestations et ajoutez des témoignages clients.
      </p>

      {/* Services */}
      <div className="mb-10">
        <h3 className="font-display font-bold text-lg mb-4">Vos services</h3>
        <div className="space-y-4">
          {data.services.map((service, i) => (
            <div
              key={service.id}
              className="p-5 rounded-xl border border-surface-200 bg-surface-50/50 relative group"
            >
              {data.services.length > 1 && (
                <button
                  onClick={() => removeService(i)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="label-field">Nom du service</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: Coupe homme"
                    maxLength={255}
                    value={service.title}
                    onChange={(e) => updateService(i, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field">Prix (optionnel)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: 25€"
                    maxLength={50}
                    value={service.price || ""}
                    onChange={(e) => updateService(i, "price", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="label-field">Description</label>
                <textarea
                  className="textarea-field !min-h-[70px]"
                  placeholder="Décrivez brièvement ce service..."
                  maxLength={1000}
                  value={service.description}
                  onChange={(e) =>
                    updateService(i, "description", e.target.value)
                  }
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        {data.services.length < 20 && (
          <button onClick={addService} className="btn-secondary mt-4">
            <Plus className="w-4 h-4" />
            Ajouter un service
          </button>
        )}
      </div>

      {/* Testimonials */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4">
          Témoignages clients
        </h3>
        <p className="text-sm text-surface-500 mb-4">
          Des avis de vos clients satisfaits à afficher sur le site.
        </p>
        <div className="space-y-4">
          {data.testimonials.map((t, i) => (
            <div
              key={t.id}
              className="p-5 rounded-xl border border-surface-200 bg-surface-50/50 relative group"
            >
              {data.testimonials.length > 1 && (
                <button
                  onClick={() => removeTestimonial(i)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="label-field">Nom du client</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: Marie D."
                    maxLength={255}
                    value={t.author}
                    onChange={(e) =>
                      updateTestimonial(i, "author", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="label-field">Note</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateTestimonial(i, "rating", star)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= t.rating ? "grayscale-0" : "grayscale opacity-30"
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="label-field">Avis</label>
                <textarea
                  className="textarea-field !min-h-[70px]"
                  placeholder="Ce que le client a dit..."
                  maxLength={1000}
                  value={t.text}
                  onChange={(e) =>
                    updateTestimonial(i, "text", e.target.value)
                  }
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        {data.testimonials.length < 20 && (
          <button onClick={addTestimonial} className="btn-secondary mt-4">
            <Plus className="w-4 h-4" />
            Ajouter un témoignage
          </button>
        )}
      </div>
    </div>
  );
}
