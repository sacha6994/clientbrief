"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Clock, X } from "lucide-react";
import type { Brief } from "@/lib/types";

interface AnalysisResult { score: number; details: { section: string; filled: number; total: number }[]; suggestions?: { priority: string; section: string; message: string }[]; estimated_dev_hours?: number; site_structure?: string[]; }

interface Props { brief: Brief; onClose: () => void; }

export function BriefAnalysis({ brief, onClose }: Props) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/brief-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submission: brief.submission }) });
      if (!res.ok) throw new Error("Failed");
      setAnalysis(await res.json());
    } catch { setError("Erreur lors de l'analyse"); }
    finally { setLoading(false); }
  };

  const priorityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
    high: { icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
    medium: { icon: Clock, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" },
    low: { icon: CheckCircle2, color: "#06B6D4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.15)" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(4,8,15,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up glass-card-glow" style={{ borderRadius: 16 }}>
        <div className="p-6 shrink-0 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
          <div>
            <h2 className="text-[16px] font-semibold text-txt-primary flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet" /> Analyse IA</h2>
            <p className="text-[12px] text-txt-muted">{brief.project_name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer text-txt-muted" style={{ background: "rgba(255,255,255,0.04)" }}><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!analysis && !loading && (
            <div className="text-center py-8">
              <p className="text-txt-secondary text-[13px] mb-4">L&apos;IA analyse la complétude et propose des suggestions.</p>
              <button onClick={runAnalysis} className="btn-primary cursor-pointer" style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#8B5CF6" }}>
                <Sparkles className="w-4 h-4" /> Lancer l&apos;analyse
              </button>
            </div>
          )}
          {loading && <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet mx-auto mb-3" /><p className="text-txt-secondary text-[13px]">Analyse en cours...</p></div>}
          {error && <div className="text-center py-8"><p className="text-[13px] mb-4" style={{ color: "#EF4444" }}>{error}</p><button onClick={runAnalysis} className="btn-secondary cursor-pointer">Réessayer</button></div>}

          {analysis && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={analysis.score >= 80 ? "#10B981" : analysis.score >= 50 ? "#F59E0B" : "#EF4444"} strokeWidth="6" strokeDasharray={`${analysis.score * 2.64} 264`} strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${analysis.score >= 80 ? "#10B98166" : analysis.score >= 50 ? "#F59E0B66" : "#EF444466"})` }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[22px] font-bold text-txt-primary">{analysis.score}%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {analysis.details.map(d => (
                  <div key={d.section} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.08)" }}>
                    <span className="text-[14px] font-bold text-txt-primary block">{d.filled}/{d.total}</span>
                    <span className="text-[10px] text-txt-muted">{d.section}</span>
                  </div>
                ))}
              </div>
              {analysis.estimated_dev_hours && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan" /><span className="font-semibold text-[13px] text-cyan">~{analysis.estimated_dev_hours}h de développement</span></div>
                </div>
              )}
              {analysis.site_structure && analysis.site_structure.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[12px] text-txt-secondary mb-2">Structure proposée</h3>
                  <div className="flex flex-wrap gap-2">{analysis.site_structure.map((p, i) => <span key={i} className="px-3 py-1.5 rounded-full text-[11px] font-medium" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.12)", color: "#94A3B8" }}>{p}</span>)}</div>
                </div>
              )}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[12px] text-txt-secondary mb-3">Suggestions</h3>
                  <div className="space-y-2">
                    {analysis.suggestions.map((s, i) => {
                      const cfg = priorityConfig[s.priority] || priorityConfig.low;
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="p-3 rounded-xl flex items-start gap-2" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cfg.color }} />
                          <div><span className="text-[10px] font-semibold uppercase tracking-wide block mb-0.5" style={{ color: cfg.color }}>{s.section}</span><span className="text-[12px] text-txt-secondary">{s.message}</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(6,182,212,0.1)" }}>
          <button onClick={onClose} className="btn-secondary w-full cursor-pointer">Fermer</button>
        </div>
      </div>
    </div>
  );
}
