"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";

interface Props { briefId: string; category: string; existingUrls: string[]; onUrlsChange: (urls: string[]) => void; maxFiles?: number; accept?: string; }

export function FileUpload({ briefId, category, existingUrls, onUrlsChange, maxFiles = 10, accept = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => { const fd = new FormData(); fd.append("file", file); fd.append("briefId", briefId); fd.append("category", category); const r = await fetch("/api/upload", { method: "POST", body: fd }); if (!r.ok) { const d = await r.json(); throw new Error(d.error); } return (await r.json()).url; };
  const handleFiles = useCallback(async (files: FileList | File[]) => { const a = Array.from(files); const rem = maxFiles - existingUrls.filter(Boolean).length; if (a.length > rem) { setError(`Max ${maxFiles} fichiers.`); return; } setUploading(true); setError(null); try { const urls: string[] = []; for (const f of a) { const u = await uploadFile(f); if (u) urls.push(u); } onUrlsChange([...existingUrls.filter(Boolean), ...urls]); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setUploading(false); } }, [briefId, existingUrls, maxFiles, onUrlsChange]);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); }, [handleFiles]);
  const validUrls = existingUrls.filter(Boolean);

  return (
    <div>
      <div onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop}
        className={`relative rounded-xl p-6 text-center transition-all cursor-pointer border-2 border-dashed ${dragActive ? "border-ice-400 bg-ice-50/50" : "border-ice-200/50 hover:border-ice-300 bg-white/30"}`}>
        <input type="file" multiple accept={accept} onChange={e => e.target.files && handleFiles(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
        {uploading ? <div className="flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 text-ice-500 animate-spin" /><span className="text-[12px] text-txt-secondary">Upload...</span></div>
         : <div className="flex flex-col items-center gap-2"><Upload className="w-8 h-8 text-txt-muted" /><span className="text-[12px] text-txt-secondary font-medium">Glissez vos fichiers ici</span><span className="text-[11px] text-txt-muted">JPG, PNG, WebP, SVG, PDF — Max 10 Mo</span></div>}
      </div>
      {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
      {validUrls.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">{validUrls.map((url, i) => <div key={i} className="relative group rounded-xl overflow-hidden glass-card">{url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || url.includes("supabase") ? <img src={url} alt="" className="w-full h-24 object-cover" /> : <div className="w-full h-24 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>}<button onClick={() => onUrlsChange(existingUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X className="w-3 h-3" /></button></div>)}</div>}
      <details className="mt-3"><summary className="text-[11px] text-txt-muted cursor-pointer hover:text-txt-secondary">Ou ajoutez un lien</summary><div className="mt-2"><input type="url" className="input-field text-[12px]" placeholder="https://drive.google.com/..." onKeyDown={e => { if (e.key === "Enter") { const i = e.currentTarget; if (i.value) { onUrlsChange([...existingUrls, i.value]); i.value = ""; } } }} /></div></details>
    </div>
  );
}
