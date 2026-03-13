"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import type { Brief } from "@/lib/types";

interface Props {
  brief: Brief;
  onClose: () => void;
}

export function JsonExportModal({ brief, onClose }: Props) {
  const [jsonData, setJsonData] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const loadSubmission = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefs/${brief.id}`);
      const data = await res.json();
      if (data.brief?.submission) {
        const formatted = JSON.stringify(data.brief.submission, null, 2);
        setJsonData(formatted);
      }
    } catch {
      setJsonData('{ "error": "Impossible de charger les données" }');
    }
  }, [brief.id]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-slide-up">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-display font-bold">Export JSON</h2>
            <p className="text-sm text-surface-500">{brief.project_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyJson} className="btn-secondary !py-2 !px-3">
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copié !" : "Copier"}
            </button>
            <button onClick={downloadJson} className="btn-primary !py-2 !px-3">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <pre className="text-xs font-mono bg-surface-950 text-emerald-400 p-6 rounded-xl overflow-auto leading-relaxed">
            {jsonData || "Chargement..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
