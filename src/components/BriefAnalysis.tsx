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

  const run = async () => { setLoading(true); setError(""); try { const r = await fetch("/api/brief-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submission: brief.submission }) }); if (!r.ok) throw new Error(); setAnalysis(await r.json()); } catch { setError("Erreur"); } finally { setLoading(false); } };

  const pCfg: Record<string, { icon: typeof AlertTriangle; cls: string }> = {
    high: { icon: AlertTriangle, cls: "bg-red-50 border-red-200 text-red-600" },
    medium: { icon: Clock, cls: "bg-amber-50 border-amber-200 text-amber-600" },
    low: { icon: CheckCircle2, cls: "bg-ice-50 border-ice-200 text-ice-600" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ice-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-slide-up glass-card-glow rounded-t-2xl sm:rounded-2xl">
        <div className="p-4 sm:p-6 shrink-0 flex items-center justify-between border-b border-ice-100/50">
          <div><h2 className="text-[14px] sm:text-[16px] font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-500" /> Analyse IA</h2><p className="text-[11px] sm:text-[12px] text-txt-muted">{brief.project_name}</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ice-100/50 text-txt-muted cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {!analysis && !loading && <div className="text-center py-8"><p className="text-txt-secondary text-[12px] sm:text-[13px] mb-4">Analyse de complétude + suggestions.</p><button onClick={run} className="btn-primary w-full sm:w-auto !bg-gradient-to-r !from-violet-400 !to-violet-600 !border-violet-400/30"><Sparkles className="w-4 h-4" /> Lancer</button></div>}
          {loading && <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-3" /><p className="text-txt-secondary text-[13px]">Analyse...</p></div>}
          {error && <div className="text-center py-8"><p className="text-red-500 text-[13px] mb-4">{error}</p><button onClick={run} className="btn-secondary">Réessayer</button></div>}
          {analysis && (
            <div className="space-y-5 sm:space-y-6">
              <div className="text-center"><div className="relative w-24 sm:w-28 h-24 sm:h-28 mx-auto mb-3"><svg className="w-full h-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#E0EFFF" strokeWidth="6" /><circle cx="50" cy="50" r="42" fill="none" stroke={analysis.score >= 80 ? "#059669" : analysis.score >= 50 ? "#D97706" : "#DC2626"} strokeWidth="6" strokeDasharray={`${analysis.score * 2.64} 264`} strokeLinecap="round" /></svg><span className="absolute inset-0 flex items-center justify-center text-[20px] sm:text-[22px] font-bold">{analysis.score}%</span></div></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{analysis.details.map(d => <div key={d.section} className="text-center p-2.5 sm:p-3 rounded-xl glass-card"><span className="text-[13px] sm:text-[14px] font-bold block">{d.filled}/{d.total}</span><span className="text-[10px] text-txt-muted">{d.section}</span></div>)}</div>
              {analysis.estimated_dev_hours && <div className="p-3 sm:p-4 rounded-xl bg-ice-50 border border-ice-200/50 flex items-center gap-2"><Clock className="w-4 h-4 text-ice-600" /><span className="font-semibold text-[12px] sm:text-[13px] text-ice-700">~{analysis.estimated_dev_hours}h</span></div>}
              {analysis.site_structure && analysis.site_structure.length > 0 && <div><h3 className="font-semibold text-[12px] text-txt-secondary mb-2">Structure</h3><div className="flex flex-wrap gap-1.5 sm:gap-2">{analysis.site_structure.map((p, i) => <span key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full glass-card text-[10px] sm:text-[11px] font-medium">{p}</span>)}</div></div>}
              {analysis.suggestions && analysis.suggestions.length > 0 && <div><h3 className="font-semibold text-[12px] text-txt-secondary mb-3">Suggestions</h3><div className="space-y-2">{analysis.suggestions.map((s, i) => { const c = pCfg[s.priority] || pCfg.low; const I = c.icon; return <div key={i} className={`p-2.5 sm:p-3 rounded-xl flex items-start gap-2 border ${c.cls}`}><I className="w-4 h-4 shrink-0 mt-0.5" /><div><span className="text-[10px] font-semibold uppercase tracking-wide block mb-0.5">{s.section}</span><span className="text-[11px] sm:text-[12px]">{s.message}</span></div></div>; })}</div></div>}
            </div>
          )}
        </div>
        <div className="p-4 shrink-0 border-t border-ice-100/50"><button onClick={onClose} className="btn-secondary w-full">Fermer</button></div>
      </div>
    </div>
  );
}
