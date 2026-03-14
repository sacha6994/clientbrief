"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import type { Brief } from "@/lib/types";

interface Props { brief: Brief; onClose: () => void; }

export function JsonExportModal({ brief, onClose }: Props) {
  const [jsonData, setJsonData] = useState("");
  const [copied, setCopied] = useState(false);

  const loadSubmission = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefs/${brief.id}`);
      const data = await res.json();
      if (data.brief?.submission) setJsonData(JSON.stringify(data.brief.submission, null, 2));
    } catch { setJsonData('{ "error": "Impossible de charger" }'); }
  }, [brief.id]);

  useEffect(() => { loadSubmission(); }, [loadSubmission]);

  const copyJson = () => { navigator.clipboard.writeText(jsonData); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.json`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(4,8,15,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col animate-slide-up glass-card-glow" style={{ borderRadius: 16 }}>
        <div className="p-6 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
          <div>
            <h2 className="text-[16px] font-semibold text-txt-primary">Export JSON</h2>
            <p className="text-[12px] text-txt-muted">{brief.project_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyJson} className="btn-secondary !py-2 !px-3 cursor-pointer">
              {copied ? <Check className="w-4 h-4" style={{ color: "#10B981" }} /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié" : "Copier"}
            </button>
            <button onClick={downloadJson} className="btn-primary !py-2 !px-3 cursor-pointer"><Download className="w-4 h-4" /> .json</button>
            <button onClick={onClose} className="p-2 rounded-lg cursor-pointer text-txt-muted hover:text-txt-secondary" style={{ background: "rgba(255,255,255,0.04)" }}><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <pre className="text-[11px] font-mono p-6 rounded-xl overflow-auto leading-relaxed"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6,182,212,0.1)", color: "#06B6D4" }}>
            {jsonData || "Chargement..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
