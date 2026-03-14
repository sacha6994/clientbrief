"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";

interface Props { briefId: string; category: string; existingUrls: string[]; onUrlsChange: (urls: string[]) => void; maxFiles?: number; accept?: string; }

export function FileUpload({ briefId, category, existingUrls, onUrlsChange, maxFiles = 10, accept = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData(); fd.append("file", file); fd.append("briefId", briefId); fd.append("category", category);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Upload failed"); }
    return (await res.json()).url;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const remaining = maxFiles - existingUrls.filter(Boolean).length;
    if (arr.length > remaining) { setError(`Max ${maxFiles} fichiers. Reste ${remaining} place(s).`); return; }
    setUploading(true); setError(null);
    try {
      const urls: string[] = [];
      for (const f of arr) { const u = await uploadFile(f); if (u) urls.push(u); }
      onUrlsChange([...existingUrls.filter(Boolean), ...urls]);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
    finally { setUploading(false); }
  }, [briefId, existingUrls, maxFiles, onUrlsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); }, [handleFiles]);
  const removeUrl = (i: number) => onUrlsChange(existingUrls.filter((_, idx) => idx !== i));
  const validUrls = existingUrls.filter(Boolean);

  return (
    <div>
      <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop}
        className="relative rounded-xl p-6 text-center transition-all duration-200 cursor-pointer"
        style={dragActive
          ? { border: "2px dashed rgba(6,182,212,0.5)", background: "rgba(6,182,212,0.06)" }
          : { border: "2px dashed rgba(6,182,212,0.15)", background: "rgba(255,255,255,0.02)" }}>
        <input type="file" multiple accept={accept} onChange={(e) => e.target.files && handleFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
        {uploading
          ? <div className="flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 text-cyan animate-spin" /><span className="text-[12px] text-txt-secondary">Upload en cours...</span></div>
          : <div className="flex flex-col items-center gap-2"><Upload className="w-8 h-8 text-txt-muted" /><span className="text-[12px] text-txt-secondary font-medium">Glissez vos fichiers ici</span><span className="text-[11px] text-txt-ghost">JPG, PNG, WebP, SVG, PDF — Max 10 Mo</span></div>
        }
      </div>
      {error && <p className="mt-2 text-[12px]" style={{ color: "#EF4444" }}>{error}</p>}
      {validUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {validUrls.map((url, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden" style={{ border: "1px solid rgba(6,182,212,0.12)", background: "rgba(255,255,255,0.03)" }}>
              {url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || url.includes("supabase")
                ? <img src={url} alt={`Upload ${i + 1}`} className="w-full h-24 object-cover" />
                : <div className="w-full h-24 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-neon-green" /></div>}
              <button onClick={() => removeUrl(i)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style={{ background: "rgba(239,68,68,0.8)" }}>
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <details className="mt-3">
        <summary className="text-[11px] text-txt-ghost cursor-pointer hover:text-txt-muted">Ou ajoutez un lien manuellement</summary>
        <div className="mt-2 flex gap-2">
          <input type="url" className="input-field text-[12px]" placeholder="https://drive.google.com/..."
            onKeyDown={(e) => { if (e.key === "Enter") { const inp = e.currentTarget; if (inp.value) { onUrlsChange([...existingUrls, inp.value]); inp.value = ""; } } }} />
        </div>
      </details>
    </div>
  );
}
