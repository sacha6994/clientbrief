"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import type { Brief } from "@/lib/types";

interface Props { brief: Brief; onClose: () => void; }

export function JsonExportModal({ brief, onClose }: Props) {
  const [jsonData, setJsonData] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => { try { const r = await fetch(`/api/briefs/${brief.id}`); const d = await r.json(); if (d.brief?.submission) setJsonData(JSON.stringify(d.brief.submission, null, 2)); } catch { setJsonData('{ "error": "Impossible de charger" }'); } }, [brief.id]);
  useEffect(() => { load(); }, [load]);

  const copyJson = () => { navigator.clipboard.writeText(jsonData); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const dl = () => { const b = new Blob([jsonData], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.json`; a.click(); URL.revokeObjectURL(u); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ice-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col animate-slide-up glass-card-glow" style={{ borderRadius: 20 }}>
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-ice-100/50">
          <div><h2 className="text-[16px] font-semibold">Export JSON</h2><p className="text-[12px] text-txt-muted">{brief.project_name}</p></div>
          <div className="flex items-center gap-2">
            <button onClick={copyJson} className="btn-secondary !py-2 !px-3">{copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}{copied ? "Copié" : "Copier"}</button>
            <button onClick={dl} className="btn-primary !py-2 !px-3"><Download className="w-4 h-4" /> .json</button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-ice-100/50 text-txt-muted cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <pre className="text-[11px] font-mono p-6 rounded-xl overflow-auto leading-relaxed bg-slate-800 text-ice-300 border border-slate-700">{jsonData || "Chargement..."}</pre>
        </div>
      </div>
    </div>
  );
}
