"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { Brief } from "@/lib/types";

interface AnalysisResult {
  score: number;
  details: { section: string; filled: number; total: number }[];
  suggestions?: { priority: string; section: string; message: string }[];
  estimated_dev_hours?: number;
  site_structure?: string[];
}

interface Props {
  brief: Brief;
  onClose: () => void;
}

export function BriefAnalysis({ brief, onClose }: Props) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brief-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission: brief.submission }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setError("Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const priorityConfig = {
    high: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    medium: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    low: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up">
        <div className="p-6 border-b border-surface-100 shrink-0">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Analyse IA du brief
          </h2>
          <p className="text-sm text-surface-500">{brief.project_name}</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!analysis && !loading && (
            <div className="text-center py-8">
              <p className="text-surface-500 mb-4">
                L&apos;IA va analyser la complétude du brief et proposer des suggestions d&apos;amélioration.
              </p>
              <button onClick={runAnalysis} className="btn-primary">
                <Sparkles className="w-4 h-4" />
                Lancer l&apos;analyse
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-3" />
              <p className="text-surface-500">Analyse en cours...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={runAnalysis} className="btn-secondary">Réessayer</button>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={analysis.score >= 80 ? "#10b981" : analysis.score >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="8"
                      strokeDasharray={`${analysis.score * 2.64} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-display font-bold">
                    {analysis.score}%
                  </span>
                </div>
                <p className="text-sm text-surface-500">Score de complétude</p>
              </div>

              {/* Section details */}
              <div className="grid grid-cols-3 gap-2">
                {analysis.details.map((d) => (
                  <div key={d.section} className="text-center p-3 rounded-xl bg-surface-50 border border-surface-100">
                    <span className="text-lg font-bold block">
                      {d.filled}/{d.total}
                    </span>
                    <span className="text-xs text-surface-500">{d.section}</span>
                  </div>
                ))}
              </div>

              {/* Dev estimate */}
              {analysis.estimated_dev_hours && (
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span className="font-display font-bold text-brand-700">
                      Estimation : ~{analysis.estimated_dev_hours}h de développement
                    </span>
                  </div>
                </div>
              )}

              {/* Site structure */}
              {analysis.site_structure && analysis.site_structure.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-sm mb-2">Structure de site proposée</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.site_structure.map((page, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-surface-100 text-sm font-medium">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-sm mb-3">Suggestions</h3>
                  <div className="space-y-2">
                    {analysis.suggestions.map((s, i) => {
                      const config = priorityConfig[s.priority as keyof typeof priorityConfig] || priorityConfig.low;
                      const Icon = config.icon;
                      return (
                        <div key={i} className={`p-3 rounded-xl ${config.bg} border ${config.border} flex items-start gap-2`}>
                          <Icon className={`w-4 h-4 ${config.color} shrink-0 mt-0.5`} />
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wide block mb-0.5">{s.section}</span>
                            <span className="text-sm">{s.message}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-surface-100 shrink-0">
          <button onClick={onClose} className="btn-secondary w-full">Fermer</button>
        </div>
      </div>
    </div>
  );
}
