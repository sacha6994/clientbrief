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
} from "lucide-react";
import type { Brief } from "@/lib/types";
import { CreateBriefModal } from "@/components/CreateBriefModal";
import { JsonExportModal } from "@/components/JsonExportModal";

export default function DashboardPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [jsonBrief, setJsonBrief] = useState<Brief | null>(null);

  const loadBriefs = useCallback(async () => {
    try {
      const res = await fetch("/api/briefs");
      const data = await res.json();
      setBriefs(data.briefs || []);
    } catch {
      console.error("Failed to load briefs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBriefs();
  }, [loadBriefs]);

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/brief/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteBrief = async (id: string) => {
    if (!confirm("Supprimer ce brief ?")) return;
    await fetch(`/api/briefs/${id}`, { method: "DELETE" });
    loadBriefs();
  };

  const statusLabels = {
    pending: "En attente",
    in_progress: "En cours",
    completed: "Complété",
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
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Nouveau brief
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Total briefs",
              value: briefs.length,
              color: "text-surface-800",
            },
            {
              label: "En attente",
              value: briefs.filter((b) => b.status === "pending").length,
              color: "text-amber-600",
            },
            {
              label: "Complétés",
              value: briefs.filter((b) => b.status === "completed").length,
              color: "text-emerald-600",
            },
          ].map((s) => (
            <div key={s.label} className="card p-6">
              <p className="text-sm text-surface-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-display font-bold ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
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
              Aucun brief pour le moment
            </h3>
            <p className="text-surface-500 mb-6">
              Créez votre premier brief pour commencer la collecte
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              Créer un brief
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {briefs.map((brief) => (
              <div
                key={brief.id}
                className="card p-6 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-bold text-lg">
                      {brief.project_name}
                    </h3>
                    <span className={`badge-${brief.status}`}>
                      {statusLabels[brief.status]}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500">
                    {brief.client_name} · {brief.client_email}
                  </p>
                  <p className="text-xs text-surface-400 mt-1">
                    Créé le{" "}
                    {new Date(brief.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <button
                      onClick={() => setJsonBrief(brief)}
                      className="btn-primary !py-2 !px-3"
                      title="Exporter JSON"
                    >
                      <FileJson2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteBrief(brief.id)}
                    className="btn-secondary !py-2 !px-3 !text-red-500 hover:!bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
}
