"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Copy, Check, ExternalLink, FileJson2, ClipboardList, Trash2, ArrowLeft, Loader2, Search, Sparkles, LogOut, Download, Filter, Clock, CheckCircle2, AlertCircle, Archive, CopyPlus, FileText, X, Send } from "lucide-react";
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
  const [notesBrief, setNotesBrief] = useState<Brief | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadBriefs = useCallback(async () => {
    try { const p = new URLSearchParams(); if (search) p.set("search", search); if (statusFilter !== "all") p.set("status", statusFilter); const r = await fetch(`/api/briefs?${p}`); const d = await r.json(); setBriefs(d.briefs || []); setTotal(d.total || 0); } catch {} finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { setLoading(true); const t = setTimeout(loadBriefs, 300); return () => clearTimeout(t); }, [loadBriefs]);

  const copyLink = (token: string) => { navigator.clipboard.writeText(`${window.location.origin}/brief/${token}`); setCopiedId(token); setTimeout(() => setCopiedId(null), 2000); };
  const handleDelete = async (id: string) => { if (!confirm("Supprimer définitivement ?")) return; setDeletingId(id); try { await fetch(`/api/briefs/${id}`, { method: "DELETE" }); loadBriefs(); } finally { setDeletingId(null); } };
  const handleArchive = async (id: string) => { setActioningId(id); try { await fetch(`/api/briefs/${id}/archive`, { method: "PUT" }); loadBriefs(); } finally { setActioningId(null); } };
  const handleDuplicate = async (id: string) => { setActioningId(id); try { const r = await fetch(`/api/briefs/${id}/duplicate`, { method: "POST" }); if (r.ok) loadBriefs(); } finally { setActioningId(null); } };
  const openNotes = (brief: Brief) => { setNotesBrief(brief); setNotesText(brief.internal_notes || ""); };
  const saveNotes = async () => { if (!notesBrief) return; setSavingNotes(true); try { await fetch(`/api/briefs/${notesBrief.id}/notes`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: notesText }) }); loadBriefs(); setNotesBrief(null); } finally { setSavingNotes(false); } };
  const downloadBrief = (brief: Brief) => { if (!brief.submission) return; const s = brief.submission; const ps = s.project_scope; const sl = s.seo_legal; const lines = [`BRIEF — ${brief.project_name}`, `Client: ${brief.client_name}`, `Email: ${brief.client_email}`, "", `Nom: ${s.business_info?.business_name || "—"}`, `Activité: ${s.business_info?.activity_description || "—"}`, `Hero: ${s.content?.hero_title || "—"}`, `Pages: ${ps?.pages_wanted?.join(", ") || "—"}`, `Budget: ${ps?.budget || "—"}`, `Deadline: ${ps?.deadline || "—"}`, `Mots-clés: ${sl?.keywords || "—"}`, `SIRET: ${sl?.siret || "—"}`]; const b = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.txt`; a.click(); URL.revokeObjectURL(u); };
  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; };

  const statusLabels: Record<string, string> = { pending: "En attente", in_progress: "En cours", completed: "Complété", archived: "Archivé" };
  const statusIcons: Record<string, typeof Clock> = { pending: AlertCircle, in_progress: Clock, completed: CheckCircle2, archived: Archive };
  const stepLabels: Record<string, string> = { welcome: "Bienvenue", business: "Entreprise", identity: "Identité", content: "Contenus", services: "Services", project: "Projet", seo: "SEO", photos: "Photos", social: "Réseaux", review: "Récap" };

  return (
    <div className="min-h-screen">
      <header className="glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="text-txt-muted hover:text-txt-secondary transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shadow-md shadow-ice-400/20"><ClipboardList className="w-4 h-4 text-white" /></div>
              <span className="font-semibold text-[13px] sm:text-[14px]">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setShowCreate(true)} className="btn-primary text-[12px] sm:text-[13px] !px-3 sm:!px-5"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nouveau brief</span><span className="sm:hidden">Nouveau</span></button>
            <button onClick={handleLogout} className="btn-secondary !py-2 !px-2.5 sm:!px-3"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Total", value: total, color: "text-txt-primary", icon: ClipboardList },
            { label: "En attente", value: briefs.filter(b => b.status === "pending").length, color: "text-amber-600", icon: AlertCircle },
            { label: "En cours", value: briefs.filter(b => b.status === "in_progress").length, color: "text-ice-600", icon: Clock },
            { label: "Complétés", value: briefs.filter(b => b.status === "completed").length, color: "text-emerald-600", icon: CheckCircle2 },
          ].map(s => (
            <div key={s.label} className="glass-card p-3 sm:p-5">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2"><s.icon className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${s.color}`} /><p className="text-[11px] sm:text-[12px] text-txt-muted">{s.label}</p></div>
              <p className={`text-[18px] sm:text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative"><Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-txt-muted" /><input type="text" className="input-field !pl-11" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-txt-muted shrink-0" />
            {["all", "pending", "in_progress", "completed", "archived"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${statusFilter === s ? "bg-ice-500 text-white shadow-md shadow-ice-400/20" : "glass-card !rounded-lg text-txt-secondary"}`}>
                {s === "all" ? "Tous" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ice-500" /></div>
        : briefs.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-4"><ClipboardList className="w-7 sm:w-8 h-7 sm:h-8 text-txt-muted" /></div>
            <h3 className="font-semibold text-[15px] sm:text-[16px] mb-2">{search || statusFilter !== "all" ? "Aucun résultat" : "Aucun brief"}</h3>
            <p className="text-txt-secondary text-[12px] sm:text-[13px] mb-6">{search || statusFilter !== "all" ? "Modifiez vos filtres" : "Créez votre premier brief"}</p>
            {!search && statusFilter === "all" && <button onClick={() => setShowCreate(true)} className="btn-primary w-full sm:w-auto"><Plus className="w-4 h-4" /> Créer un brief</button>}
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map(brief => {
              const { score } = computeCompletenessScore(brief.submission || brief.draft_submission);
              const SIcon = statusIcons[brief.status] || AlertCircle;
              const isArchived = brief.status === "archived";
              const isExpanded = expandedId === brief.id;
              return (
                <div key={brief.id} className={`glass-card p-4 sm:p-5 transition-all ${isArchived ? "opacity-60" : ""}`}>
                  {/* Main row - always visible */}
                  <div className="flex items-start sm:items-center justify-between gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : brief.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                        <h3 className="font-semibold text-[13px] sm:text-[14px] truncate max-w-[180px] sm:max-w-none">{brief.project_name}</h3>
                        <span className={`badge-${brief.status === "archived" ? "pending" : brief.status}`}><SIcon className="w-3 h-3" />{statusLabels[brief.status]}</span>
                        {brief.status === "in_progress" && brief.current_step && <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-ice-100/60 text-ice-600 hidden sm:inline">{stepLabels[brief.current_step]}</span>}
                        {brief.internal_notes && <span><FileText className="w-3 h-3 text-amber-400" /></span>}
                      </div>
                      <p className="text-[11px] sm:text-[12px] text-txt-secondary truncate">{brief.client_name} · {brief.client_email}</p>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2">
                        <p className="text-[10px] sm:text-[11px] text-txt-muted">{new Date(brief.created_at).toLocaleDateString("fr-FR")}</p>
                        {(brief.submission || brief.draft_submission) && (
                          <div className="flex items-center gap-2">
                            <div className="w-16 sm:w-20 h-1.5 rounded-full bg-ice-100/50 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }} /></div>
                            <span className="text-[10px] sm:text-[11px] text-txt-muted">{score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Desktop actions - hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ opacity: 1 }}>
                      <button onClick={e => { e.stopPropagation(); copyLink(brief.token); }} className="btn-secondary !py-2 !px-2.5">{copiedId === brief.token ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}</button>
                      <Link href={`/brief/${brief.token}`} target="_blank" className="btn-secondary !py-2 !px-2.5" onClick={e => e.stopPropagation()}><ExternalLink className="w-3.5 h-3.5" /></Link>
                      <button onClick={e => { e.stopPropagation(); openNotes(brief); }} className="btn-secondary !py-2 !px-2.5"><FileText className="w-3.5 h-3.5" /></button>
                      <button onClick={e => { e.stopPropagation(); handleDuplicate(brief.id); }} disabled={actioningId === brief.id} className="btn-secondary !py-2 !px-2.5">{actioningId === brief.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CopyPlus className="w-3.5 h-3.5" />}</button>
                      {brief.status === "completed" && (
                        <>
                          <button onClick={e => { e.stopPropagation(); setJsonBrief(brief); }} className="btn-primary !py-2 !px-2.5"><FileJson2 className="w-3.5 h-3.5" /></button>
                          <button onClick={e => { e.stopPropagation(); downloadBrief(brief); }} className="btn-secondary !py-2 !px-2.5"><Download className="w-3.5 h-3.5" /></button>
                          <button onClick={e => { e.stopPropagation(); setAnalysisBrief(brief); }} className="btn-secondary !py-2 !px-2.5 !text-violet-500"><Sparkles className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                      {!isArchived && <button onClick={e => { e.stopPropagation(); handleArchive(brief.id); }} className="btn-secondary !py-2 !px-2.5 !text-amber-500"><Archive className="w-3.5 h-3.5" /></button>}
                      <button onClick={e => { e.stopPropagation(); handleDelete(brief.id); }} disabled={deletingId === brief.id} className="btn-danger !py-2 !px-2.5">{deletingId === brief.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                    </div>
                  </div>

                  {/* Mobile actions - shown on tap */}
                  {isExpanded && (
                    <div className="sm:hidden mt-3 pt-3 border-t border-ice-100/50 grid grid-cols-4 gap-2">
                      <button onClick={() => copyLink(brief.token)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px]">{copiedId === brief.token ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}Copier</button>
                      <Link href={`/brief/${brief.token}`} target="_blank" className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><ExternalLink className="w-4 h-4" />Voir</Link>
                      <button onClick={() => openNotes(brief)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><FileText className="w-4 h-4" />Notes</button>
                      <button onClick={() => handleDuplicate(brief.id)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><CopyPlus className="w-4 h-4" />Dupliquer</button>
                      {brief.status === "completed" && (
                        <>
                          <button onClick={() => setJsonBrief(brief)} className="btn-primary !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><FileJson2 className="w-4 h-4" />JSON</button>
                          <button onClick={() => downloadBrief(brief)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><Download className="w-4 h-4" />Export</button>
                          <button onClick={() => setAnalysisBrief(brief)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px] !text-violet-500"><Sparkles className="w-4 h-4" />IA</button>
                        </>
                      )}
                      {!isArchived && <button onClick={() => handleArchive(brief.id)} className="btn-secondary !py-2.5 !px-0 flex-col !gap-1 text-[10px] !text-amber-500"><Archive className="w-4 h-4" />Archiver</button>}
                      <button onClick={() => handleDelete(brief.id)} className="btn-danger !py-2.5 !px-0 flex-col !gap-1 text-[10px]"><Trash2 className="w-4 h-4" />Suppr.</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Notes Modal */}
      {notesBrief && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-ice-900/20 backdrop-blur-sm" onClick={() => setNotesBrief(null)} />
          <div className="relative w-full sm:max-w-md p-6 glass-card-glow animate-slide-up rounded-t-2xl sm:rounded-2xl">
            <button onClick={() => setNotesBrief(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-ice-100/50 text-txt-muted cursor-pointer"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-amber-500" /><h2 className="text-[15px] sm:text-[16px] font-semibold">Notes internes</h2></div>
            <p className="text-[11px] sm:text-[12px] text-txt-muted mb-4">{notesBrief.project_name}</p>
            <textarea className="textarea-field !min-h-[120px] sm:!min-h-[140px]" placeholder="Prix, remarques, to-do..." maxLength={5000} value={notesText} onChange={e => setNotesText(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNotesBrief(null)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={saveNotes} disabled={savingNotes} className="btn-primary flex-1">{savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      {showCreate && <CreateBriefModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadBriefs(); }} />}
      {jsonBrief && <JsonExportModal brief={jsonBrief} onClose={() => setJsonBrief(null)} />}
      {analysisBrief && <BriefAnalysis brief={analysisBrief} onClose={() => setAnalysisBrief(null)} />}
    </div>
  );
}
