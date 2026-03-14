"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  FileJson2,
  ClipboardList,
  Trash2,
  ArrowLeft,
  Loader2,
  Search,
  Sparkles,
  LogOut,
  Download,
  Filter,
} from "lucide-react";
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
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/briefs?${params.toString()}`);
      const data = await res.json();
      setBriefs(data.briefs || []);
      setTotal(data.total || 0);
    } catch {
      console.error("Failed to load briefs");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(loadBriefs, 300);
    return () => clearTimeout(timeout);
  }, [loadBriefs]);

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/brief/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteBrief = async (id: string) => {
    if (!confirm("Supprimer ce brief ?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/briefs/${id}`, { method: "DELETE" });
      loadBriefs();
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const downloadPdf = async (brief: Brief) => {
    if (!brief.submission) return;
    const sub = brief.submission;

    const lines = [
      `BRIEF CLIENT — ${brief.project_name}`,
      `${"=".repeat(50)}`,
      `Client: ${brief.client_name}`,
      `Email: ${brief.client_email}`,
      `Date: ${new Date(brief.created_at).toLocaleDateString("fr-FR")}`,
      ``,
      `--- ENTREPRISE ---`,
      `Nom: ${sub.business_info?.business_name || "—"}`,
      `Slogan: ${sub.business_info?.tagline || "—"}`,
      `Activité: ${sub.business_info?.activity_description || "—"}`,
      `Clientèle: ${sub.business_info?.target_audience || "—"}`,
      `Adresse: ${sub.business_info?.address || "—"}`,
      `Téléphone: ${sub.business_info?.phone || "—"}`,
      `Email: ${sub.business_info?.email || "—"}`,
      `Horaires: ${sub.business_info?.opening_hours || "—"}`,
      ``,
      `--- IDENTITÉ VISUELLE ---`,
      `Couleur principale: ${sub.visual_identity?.primary_color || "—"}`,
      `Couleur secondaire: ${sub.visual_identity?.secondary_color || "—"}`,
      `Couleur accent: ${sub.visual_identity?.accent_color || "—"}`,
      `Style: ${sub.visual_identity?.style_preference || "—"}`,
      `Logo: ${sub.visual_identity?.has_logo ? "Fourni" : "À créer"}`,
      ``,
      `--- CONTENUS ---`,
      `Titre hero: ${sub.content?.hero_title || "—"}`,
      `Sous-titre: ${sub.content?.hero_subtitle || "—"}`,
      `À propos: ${sub.content?.about_text || "—"}`,
      `CTA: ${sub.content?.cta_text || "—"}`,
      ``,
      `--- SERVICES ---`,
      ...(sub.content?.services || [])
        .filter((s) => s.title)
        .map((s) => `• ${s.title}${s.price ? ` (${s.price})` : ""} — ${s.description}`),
      ``,
      `--- TÉMOIGNAGES ---`,
      ...(sub.content?.testimonials || [])
        .filter((t) => t.author)
        .map((t) => `• ${t.author} (${"★".repeat(t.rating)}): "${t.text}"`),
      ``,
      `--- RÉSEAUX SOCIAUX ---`,
      ...Object.entries(sub.social_links || {})
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`),
      ``,
      `--- NOTES ---`,
      sub.additional_notes || "Aucune note",
    ];

    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brief-${brief.project_name.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    in_progress: "En cours",
    completed: "Complété",
  };

  const stepLabels: Record<string, string> = {
    welcome: "Bienvenue",
    business: "Entreprise",
    identity: "Identité",
    content: "Contenus",
    services: "Services",
    photos: "Photos",
    social: "Réseaux",
    review: "Récap",
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              Nouveau brief
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary !py-2 !px-3"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total briefs", value: total, color: "text-surface-800" },
            {
              label: "En attente",
              value: briefs.filter((b) => b.status === "pending").length,
              color: "text-amber-600",
            },
            {
              label: "En cours",
              value: briefs.filter((b) => b.status === "in_progress").length,
              color: "text-blue-600",
            },
            {
              label: "Complétés",
              value: briefs.filter((b) => b.status === "completed").length,
              color: "text-emerald-600",
            },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <p className="text-sm text-surface-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-display font-bold ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              className="input-field !pl-11"
              placeholder="Rechercher par nom, email ou projet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-surface-400" />
            {["all", "pending", "in_progress", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-brand-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {s === "all" ? "Tous" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Briefs list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : briefs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">
              {search || statusFilter !== "all"
                ? "Aucun résultat"
                : "Aucun brief pour le moment"}
            </h3>
            <p className="text-surface-500 mb-6">
              {search || statusFilter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Créez votre premier brief pour commencer la collecte"}
            </p>
            {!search && statusFilter === "all" && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Créer un brief
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map((brief) => {
              const { score } = computeCompletenessScore(
                brief.submission || brief.draft_submission
              );

              return (
                <div
                  key={brief.id}
                  className="card p-5 flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-display font-bold text-lg truncate">
                        {brief.project_name}
                      </h3>
                      <span className={`badge-${brief.status}`}>
                        {statusLabels[brief.status]}
                      </span>
                      {brief.status === "in_progress" && brief.current_step && (
                        <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                          {stepLabels[brief.current_step] || brief.current_step}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-surface-500">
                      {brief.client_name} · {brief.client_email}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-xs text-surface-400">
                        Créé le{" "}
                        {new Date(brief.created_at).toLocaleDateString("fr-FR")}
                      </p>
                      {(brief.submission || brief.draft_submission) && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                score >= 80
                                  ? "bg-emerald-500"
                                  : score >= 50
                                  ? "bg-amber-500"
                                  : "bg-red-400"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs text-surface-400">{score}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                    <button
                      onClick={() => copyLink(brief.token)}
                      className="btn-secondary !py-2 !px-3"
                      title="Copier le lien"
                    >
                      {copiedId === brief.token ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <Link
                      href={`/brief/${brief.token}`}
                      target="_blank"
                      className="btn-secondary !py-2 !px-3"
                      title="Voir le wizard"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {brief.status === "completed" && (
                      <>
                        <button
                          onClick={() => setJsonBrief(brief)}
                          className="btn-primary !py-2 !px-3"
                          title="Exporter JSON"
                        >
                          <FileJson2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadPdf(brief)}
                          className="btn-secondary !py-2 !px-3"
                          title="Télécharger le brief"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAnalysisBrief(brief)}
                          className="btn-secondary !py-2 !px-3 !text-brand-600 hover:!bg-brand-50"
                          title="Analyse IA"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deleteBrief(brief.id)}
                      disabled={deletingId === brief.id}
                      className="btn-secondary !py-2 !px-3 !text-red-500 hover:!bg-red-50"
                      title="Supprimer"
                    >
                      {deletingId === brief.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreate && (
        <CreateBriefModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadBriefs();
          }}
        />
      )}

      {jsonBrief && (
        <JsonExportModal
          brief={jsonBrief}
          onClose={() => setJsonBrief(null)}
        />
      )}

      {analysisBrief && (
        <BriefAnalysis
          brief={analysisBrief}
          onClose={() => setAnalysisBrief(null)}
        />
      )}
    </div>
  );
}
