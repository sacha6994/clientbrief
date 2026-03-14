"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Copy, Check, ExternalLink, FileJson2, ClipboardList, Trash2, ArrowLeft, Loader2, Search, Sparkles, LogOut, Download, Filter, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { Brief } from "@/lib/types";
import { computeCompletenessScore } from "@/lib/types";
import { CreateBriefModal } from "@/components/CreateBriefModal";
import { JsonExportModal } from "@/components/JsonExportModal";
import { BriefAnalysis } from "@/components/BriefAnalysis";

export default function DashboardPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [jsonBrief, setJsonBrief] = useState<Brief | null>(null);
  const [analysisBrief, setAnalysisBrief] = useState<Brief | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBriefs = useCallback(async () => {
    try { const p = new URLSearchParams(); if (search) p.set("search", search); if (statusFilter !== "all") p.set("status", statusFilter); const res = await fetch(`/api/briefs?${p}`); const d = await res.json(); setBriefs(d.briefs || []); setTotal(d.total || 0); } catch {} finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { setLoading(true); const t = setTimeout(loadBriefs, 300); return () => clearTimeout(t); }, [loadBriefs]);
  const copyLink = (token: string) => { navigator.clipboard.writeText(`${window.location.origin}/brief/${token}`); setCopiedId(token); setTimeout(() => setCopiedId(null), 2000); };
  const deleteBrief = async (id: string) => { if (!confirm("Supprimer ce brief ?")) return; setDeletingId(id); try { await fetch(`/api/briefs/${id}`, { method: "DELETE" }); loadBriefs(); } finally { setDeletingId(null); } };
  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; };
  const downloadBrief = (brief: Brief) => { if (!brief.submission) return; const s = brief.submission; const t = [`BRIEF — ${brief.project_name}`, `Client: ${brief.client_name}`, `Email: ${brief.client_email}`, "", `Nom: ${s.business_info?.business_name || "—"}`, `Activité: ${s.business_info?.activity_description || "—"}`, `Hero: ${s.content?.hero_title || "—"}`, `À propos: ${s.content?.about_text || "—"}`].join("\n"); const b = new Blob([t], { type: "text/plain;charset=utf-8" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.txt`; a.click(); URL.revokeObjectURL(u); };

  const statusLabels: Record<string, string> = { pending: "En attente", in_progress: "En cours", completed: "Complété" };
  const statusIcons: Record<string, typeof Clock> = { pending: AlertCircle, in_progress: Clock, completed: CheckCircle2 };
  const stepLabels: Record<string, string> = { welcome: "Bienvenue", business: "Entreprise", identity: "Identité", content: "Contenus", services: "Services", photos: "Photos", social: "Réseaux", review: "Récap" };

  return (
    <div className="min-h-screen">
      <header className="glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-txt-muted hover:text-txt-secondary transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shadow-md shadow-ice-400/20"><ClipboardList className="w-4 h-4 text-white" /></div>
              <span className="font-semibold text-[14px]">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau brief</button>
            <button onClick={handleLogout} className="btn-secondary !py-2 !px-3" title="Déconnexion"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: total, color: "text-txt-primary", icon: ClipboardList },
            { label: "En attente", value: briefs.filter(b => b.status === "pending").length, color: "text-amber-600", icon: AlertCircle },
            { label: "En cours", value: briefs.filter(b => b.status === "in_progress").length, color: "text-ice-600", icon: Clock },
            { label: "Complétés", value: briefs.filter(b => b.status === "completed").length, color: "text-emerald-600", icon: CheckCircle2 },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2"><s.icon className={`w-3.5 h-3.5 ${s.color}`} /><p className="text-[12px] text-txt-muted">{s.label}</p></div>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1"><Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" /><input type="text" className="input-field !pl-11" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-txt-muted" />
            {["all", "pending", "in_progress", "completed"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${statusFilter === s ? "bg-ice-500 text-white shadow-md shadow-ice-400/20" : "glass-card !rounded-lg text-txt-secondary hover:text-ice-600"}`}>
                {s === "all" ? "Tous" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ice-500" /></div>
        : briefs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4"><ClipboardList className="w-8 h-8 text-txt-muted" /></div>
            <h3 className="font-semibold text-[16px] mb-2">{search || statusFilter !== "all" ? "Aucun résultat" : "Aucun brief"}</h3>
            <p className="text-txt-secondary text-[13px] mb-6">{search || statusFilter !== "all" ? "Modifiez vos filtres" : "Créez votre premier brief"}</p>
            {!search && statusFilter === "all" && <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus className="w-4 h-4" /> Créer un brief</button>}
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map(brief => {
              const { score } = computeCompletenessScore(brief.submission || brief.draft_submission);
              const SIcon = statusIcons[brief.status] || AlertCircle;
              return (
                <div key={brief.id} className="glass-card p-5 flex items-center justify-between group hover:shadow-lg hover:shadow-ice-300/10 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-semibold text-[14px] truncate">{brief.project_name}</h3>
                      <span className={`badge-${brief.status}`}><SIcon className="w-3 h-3" />{statusLabels[brief.status]}</span>
                      {brief.status === "in_progress" && brief.current_step && <span className="text-[11px] px-2 py-0.5 rounded-full bg-ice-100/60 text-ice-600">{stepLabels[brief.current_step]}</span>}
                    </div>
                    <p className="text-[12px] text-txt-secondary">{brief.client_name} · {brief.client_email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-[11px] text-txt-muted">{new Date(brief.created_at).toLocaleDateString("fr-FR")}</p>
                      {(brief.submission || brief.draft_submission) && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-ice-100/50 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }} />
                          </div>
                          <span className="text-[11px] text-txt-muted">{score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                    <button onClick={() => copyLink(brief.token)} className="btn-secondary !py-2 !px-3">{copiedId === brief.token ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}</button>
                    <Link href={`/brief/${brief.token}`} target="_blank" className="btn-secondary !py-2 !px-3"><ExternalLink className="w-4 h-4" /></Link>
                    {brief.status === "completed" && (
                      <>
                        <button onClick={() => setJsonBrief(brief)} className="btn-primary !py-2 !px-3"><FileJson2 className="w-4 h-4" /></button>
                        <button onClick={() => downloadBrief(brief)} className="btn-secondary !py-2 !px-3"><Download className="w-4 h-4" /></button>
                        <button onClick={() => setAnalysisBrief(brief)} className="btn-secondary !py-2 !px-3 !text-violet-500 hover:!bg-violet-50"><Sparkles className="w-4 h-4" /></button>
                      </>
                    )}
                    <button onClick={() => deleteBrief(brief.id)} disabled={deletingId === brief.id} className="btn-danger !py-2 !px-3">{deletingId === brief.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showCreate && <CreateBriefModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadBriefs(); }} />}
      {jsonBrief && <JsonExportModal brief={jsonBrief} onClose={() => setJsonBrief(null)} />}
      {analysisBrief && <BriefAnalysis brief={analysisBrief} onClose={() => setAnalysisBrief(null)} />}
    </div>
  );
}
