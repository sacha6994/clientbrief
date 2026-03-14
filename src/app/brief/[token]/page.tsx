"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, ClipboardList, Loader2, CheckCircle2, Sparkles, Save, Hand, Building2, Palette, PenTool, Zap, Camera, Link2, ListChecks, Layout, Search } from "lucide-react";
import { WIZARD_STEPS } from "@/lib/types";
import type { WizardStep } from "@/lib/types";
import { StepBusiness } from "@/components/wizard/StepBusiness";
import { StepIdentity } from "@/components/wizard/StepIdentity";
import { StepContent } from "@/components/wizard/StepContent";
import { StepServices } from "@/components/wizard/StepServices";
import { StepProject } from "@/components/wizard/StepProject";
import { StepSeo } from "@/components/wizard/StepSeo";
import { StepPhotos } from "@/components/wizard/StepPhotos";
import { StepSocial } from "@/components/wizard/StepSocial";
import { StepReview } from "@/components/wizard/StepReview";

const stepIcons: Record<string, typeof Hand> = { welcome: Hand, business: Building2, identity: Palette, content: PenTool, services: Zap, project: Layout, seo: Search, photos: Camera, social: Link2, review: ListChecks };

const defaultFormData = {
  business_info: { business_name: "", tagline: "", activity_description: "", target_audience: "", unique_selling_point: "", address: "", phone: "", email: "", opening_hours: "" },
  visual_identity: { has_logo: false, logo_url: "", primary_color: "#60A5FA", secondary_color: "#3B82F6", accent_color: "#10B981", style_preference: "modern" as const, reference_websites: [""] },
  content: { hero_title: "", hero_subtitle: "", about_text: "", services: [{ id: "1", title: "", description: "", price: "" }], testimonials: [{ id: "1", author: "", text: "", rating: 5 }], cta_text: "" },
  project_scope: { page_count: "", pages_wanted: [] as string[], features: [] as string[], has_domain: false, domain_name: "", deadline: "", budget: "", languages: ["Français"], tone: "" as const, competitors: [""] },
  seo_legal: { keywords: "", meta_description: "", siret: "", legal_name: "", legal_status: "", privacy_contact: "" },
  social_links: { facebook: "", instagram: "", tiktok: "", linkedin: "", google_maps: "", website_current: "" },
  photos: { logo_files: [] as string[], hero_photos: [] as string[], gallery_photos: [] as string[], team_photos: [] as string[] },
  additional_notes: "",
};
export type FormData = typeof defaultFormData;

export default function BriefWizardPage() {
  const params = useParams();
  const token = params.token as string;
  const [briefInfo, setBriefInfo] = useState<{ id: string; project_name: string; client_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome");
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [magicFilling, setMagicFilling] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadBrief = useCallback(async () => { try { const res = await fetch(`/api/briefs?token=${token}`); if (!res.ok) { setNotFound(true); return; } const d = await res.json(); if (d.brief) { setBriefInfo(d.brief); if (d.brief.status === "completed") setSubmitted(true); else { if (d.brief.draft_submission) setFormData(p => ({ ...p, ...d.brief.draft_submission })); if (d.brief.current_step && d.brief.current_step !== "welcome") setCurrentStep(d.brief.current_step); } } else setNotFound(true); } catch { setNotFound(true); } finally { setLoading(false); } }, [token]);
  useEffect(() => { loadBrief(); }, [loadBrief]);

  const autoSave = useCallback(async (data: FormData, step: WizardStep) => { if (!briefInfo?.id || step === "welcome") return; setSaving(true); try { await fetch(`/api/briefs/${briefInfo.id}/autosave`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ draft_submission: data, current_step: step }) }); setLastSaved(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })); } catch {} finally { setSaving(false); } }, [briefInfo?.id]);
  useEffect(() => { if (!briefInfo?.id || currentStep === "welcome") return; if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); saveTimeoutRef.current = setTimeout(() => autoSave(formData, currentStep), 2000); return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); }; }, [formData, currentStep, autoSave, briefInfo?.id]);

  const stepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);
  const goNext = () => { if (stepIndex < WIZARD_STEPS.length - 1) { const n = WIZARD_STEPS[stepIndex + 1].key; setCurrentStep(n); autoSave(formData, n); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const goBack = () => { if (stepIndex > 0) { setCurrentStep(WIZARD_STEPS[stepIndex - 1].key); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const updateField = (section: keyof FormData, key: string, value: unknown) => setFormData(p => ({ ...p, [section]: { ...(p[section] as Record<string, unknown>), [key]: value } }));

  const handleMagicFill = async () => {
    if (!formData.business_info.business_name && !formData.business_info.activity_description) { alert("Remplissez d'abord l'étape Entreprise."); return; }
    setMagicFilling(true);
    try { const res = await fetch("/api/magic-fill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName: formData.business_info.business_name, activity: formData.business_info.activity_description, tagline: formData.business_info.tagline, audience: formData.business_info.target_audience }) }); if (!res.ok) throw new Error(); const { generated } = await res.json(); setFormData(p => ({ ...p, business_info: { ...p.business_info, tagline: p.business_info.tagline || generated.tagline || "" }, content: { ...p.content, hero_title: p.content.hero_title || generated.hero_title || "", hero_subtitle: p.content.hero_subtitle || generated.hero_subtitle || "", about_text: p.content.about_text || generated.about_text || "", cta_text: p.content.cta_text || generated.cta_text || "", services: p.content.services[0]?.title ? p.content.services : generated.services?.map((s: { title: string; description: string }, i: number) => ({ id: String(i + 1), title: s.title, description: s.description, price: "" })) || p.content.services } })); } catch { alert("Échec de la génération IA."); } finally { setMagicFilling(false); }
  };

  const handleSubmit = async () => { setSubmitting(true); try { const res = await fetch(`/api/briefs/${briefInfo?.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submission: formData }) }); if (res.ok) setSubmitted(true); else { const d = await res.json(); alert(d.error || "Erreur."); } } catch { alert("Erreur."); } finally { setSubmitting(false); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-ice-500" /></div>;
  if (notFound) return <div className="min-h-screen flex items-center justify-center px-6"><div className="text-center"><h1 className="text-[18px] font-semibold mb-2">Brief introuvable</h1><p className="text-txt-secondary text-[13px]">Ce lien est invalide ou a expiré.</p></div></div>;
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200/30"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></div>
        <h1 className="text-[24px] font-bold mb-3">Merci !</h1>
        <p className="text-txt-secondary text-[14px]">Votre brief a bien été envoyé. Nous reviendrons vers vous rapidement.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="glass-card sticky top-0 z-50" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shadow-sm"><ClipboardList className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-semibold text-[13px]">{briefInfo?.project_name}</span>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && <span className="text-[11px] text-txt-muted flex items-center gap-1">{saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}{saving ? "Sauvegarde..." : `Sauvé à ${lastSaved}`}</span>}
            <span className="text-[11px] text-txt-ghost font-mono">{stepIndex + 1}/{WIZARD_STEPS.length}</span>
          </div>
        </div>
        <div className="h-[3px] bg-ice-100/50"><div className="h-full bg-gradient-to-r from-ice-400 to-ice-600 transition-all duration-500 shadow-sm shadow-ice-400/30" style={{ width: `${((stepIndex + 1) / WIZARD_STEPS.length) * 100}%` }} /></div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, i) => {
            const Icon = stepIcons[step.key] || Hand;
            return <button key={step.key} onClick={() => i <= stepIndex && setCurrentStep(step.key)} disabled={i > stepIndex}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer disabled:cursor-not-allowed ${
                step.key === currentStep ? "bg-ice-500 text-white shadow-md shadow-ice-400/20" : i < stepIndex ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" : "glass-card !rounded-full text-txt-muted"
              }`}>
              <Icon className="w-3 h-3" /><span className="hidden sm:inline">{step.label}</span>
            </button>;
          })}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="wizard-card animate-fade-in">
          {currentStep === "welcome" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-ice-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-ice-200/30"><Hand className="w-8 h-8 text-ice-500" /></div>
              <h1 className="text-[24px] font-bold mb-4">Bienvenue {briefInfo?.client_name} !</h1>
              <p className="text-txt-secondary text-[14px] max-w-lg mx-auto mb-2">Ce formulaire va collecter le contenu nécessaire pour créer votre site web.</p>
              <p className="text-txt-muted text-[12px] mb-6">~10 minutes. Sauvegarde automatique.</p>
              <div className="mt-6 p-5 rounded-2xl glass-card-glow max-w-md mx-auto">
                <Sparkles className="w-5 h-5 text-violet-500 mx-auto mb-3" />
                <p className="text-[13px] text-txt-secondary mb-2">L&apos;IA peut pré-remplir tous vos textes.</p>
                <p className="text-[11px] text-txt-muted mb-4">Remplissez d&apos;abord l&apos;étape Entreprise.</p>
                <button onClick={handleMagicFill} disabled={magicFilling} className="btn-primary text-[12px] !bg-gradient-to-r !from-violet-400 !to-violet-600 !border-violet-400/30 !shadow-violet-400/20">
                  {magicFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{magicFilling ? "Génération..." : "Remplir avec l'IA"}
                </button>
              </div>
            </div>
          )}
          {currentStep === "business" && <StepBusiness data={formData.business_info} onChange={(k, v) => updateField("business_info", k, v)} />}
          {currentStep === "identity" && <StepIdentity data={formData.visual_identity} onChange={(k, v) => updateField("visual_identity", k, v)} />}
          {currentStep === "content" && <StepContent data={formData.content} businessName={formData.business_info.business_name} activity={formData.business_info.activity_description} onChange={(k, v) => updateField("content", k, v)} onMagicFill={handleMagicFill} magicFilling={magicFilling} />}
          {currentStep === "services" && <StepServices data={formData.content} onChange={(k, v) => updateField("content", k, v)} />}
          {currentStep === "project" && <StepProject data={formData.project_scope} onChange={(k, v) => updateField("project_scope", k, v)} />}
          {currentStep === "seo" && <StepSeo data={formData.seo_legal} businessName={formData.business_info.business_name} activity={formData.business_info.activity_description} onChange={(k, v) => updateField("seo_legal", k, v)} />}
          {currentStep === "photos" && <StepPhotos data={formData.photos} briefId={briefInfo?.id || ""} onChange={(k, v) => updateField("photos", k, v)} />}
          {currentStep === "social" && <StepSocial data={formData.social_links} onChange={(k, v) => updateField("social_links", k, v)} />}
          {currentStep === "review" && <StepReview formData={formData} onNotesChange={n => setFormData(p => ({ ...p, additional_notes: n }))} />}
        </div>
        <div className="flex items-center justify-between mt-8 pb-10">
          <button onClick={goBack} disabled={stepIndex === 0} className="btn-secondary disabled:opacity-0"><ArrowLeft className="w-4 h-4" /> Retour</button>
          {currentStep === "review"
            ? <button onClick={handleSubmit} disabled={submitting} className="btn-primary !bg-gradient-to-r !from-emerald-400 !to-emerald-600 !border-emerald-400/30 !shadow-emerald-400/20">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}{submitting ? "Envoi..." : "Envoyer le brief"}</button>
            : <button onClick={goNext} className="btn-primary">Continuer <ArrowRight className="w-4 h-4" /></button>}
        </div>
      </main>
    </div>
  );
}
