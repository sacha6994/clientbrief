"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight, ArrowLeft, ClipboardList, Loader2, CheckCircle2,
  Sparkles, Save, Hand, Building2, Palette, PenTool, Zap,
  Camera, Link2, ListChecks,
} from "lucide-react";
import { WIZARD_STEPS } from "@/lib/types";
import type { WizardStep } from "@/lib/types";
import { StepBusiness } from "@/components/wizard/StepBusiness";
import { StepIdentity } from "@/components/wizard/StepIdentity";
import { StepContent } from "@/components/wizard/StepContent";
import { StepServices } from "@/components/wizard/StepServices";
import { StepPhotos } from "@/components/wizard/StepPhotos";
import { StepSocial } from "@/components/wizard/StepSocial";
import { StepReview } from "@/components/wizard/StepReview";

const stepIcons: Record<string, typeof Hand> = {
  welcome: Hand, business: Building2, identity: Palette, content: PenTool,
  services: Zap, photos: Camera, social: Link2, review: ListChecks,
};

const defaultFormData = {
  business_info: { business_name: "", tagline: "", activity_description: "", target_audience: "", unique_selling_point: "", address: "", phone: "", email: "", opening_hours: "" },
  visual_identity: { has_logo: false, logo_url: "", primary_color: "#06B6D4", secondary_color: "#8B5CF6", accent_color: "#10B981", style_preference: "modern" as const, reference_websites: [""] },
  content: { hero_title: "", hero_subtitle: "", about_text: "", services: [{ id: "1", title: "", description: "", price: "" }], testimonials: [{ id: "1", author: "", text: "", rating: 5 }], cta_text: "" },
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

  const loadBrief = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefs?token=${token}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      if (data.brief) {
        setBriefInfo(data.brief);
        if (data.brief.status === "completed") { setSubmitted(true); }
        else {
          if (data.brief.draft_submission) setFormData(prev => ({ ...prev, ...data.brief.draft_submission }));
          if (data.brief.current_step && data.brief.current_step !== "welcome") setCurrentStep(data.brief.current_step);
        }
      } else { setNotFound(true); }
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadBrief(); }, [loadBrief]);

  const autoSave = useCallback(async (data: FormData, step: WizardStep) => {
    if (!briefInfo?.id || step === "welcome") return;
    setSaving(true);
    try {
      await fetch(`/api/briefs/${briefInfo.id}/autosave`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ draft_submission: data, current_step: step }) });
      setLastSaved(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    } catch { /* silent */ }
    finally { setSaving(false); }
  }, [briefInfo?.id]);

  useEffect(() => {
    if (!briefInfo?.id || currentStep === "welcome") return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => autoSave(formData, currentStep), 2000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, currentStep, autoSave, briefInfo?.id]);

  const stepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);
  const goNext = () => { if (stepIndex < WIZARD_STEPS.length - 1) { const next = WIZARD_STEPS[stepIndex + 1].key; setCurrentStep(next); autoSave(formData, next); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const goBack = () => { if (stepIndex > 0) { setCurrentStep(WIZARD_STEPS[stepIndex - 1].key); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const updateField = (section: keyof FormData, key: string, value: unknown) => { setFormData(prev => ({ ...prev, [section]: { ...(prev[section] as Record<string, unknown>), [key]: value } })); };

  const handleMagicFill = async () => {
    if (!formData.business_info.business_name && !formData.business_info.activity_description) { alert("Remplissez d'abord le nom et l'activité (étape Entreprise)."); return; }
    setMagicFilling(true);
    try {
      const res = await fetch("/api/magic-fill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessName: formData.business_info.business_name, activity: formData.business_info.activity_description, tagline: formData.business_info.tagline, audience: formData.business_info.target_audience }) });
      if (!res.ok) throw new Error("Failed");
      const { generated } = await res.json();
      setFormData(prev => ({ ...prev, business_info: { ...prev.business_info, tagline: prev.business_info.tagline || generated.tagline || "" }, content: { ...prev.content, hero_title: prev.content.hero_title || generated.hero_title || "", hero_subtitle: prev.content.hero_subtitle || generated.hero_subtitle || "", about_text: prev.content.about_text || generated.about_text || "", cta_text: prev.content.cta_text || generated.cta_text || "", services: prev.content.services[0]?.title ? prev.content.services : generated.services?.map((s: { title: string; description: string }, i: number) => ({ id: String(i + 1), title: s.title, description: s.description, price: "" })) || prev.content.services } }));
    } catch { alert("La génération IA a échoué. Réessayez."); }
    finally { setMagicFilling(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/briefs/${briefInfo?.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submission: formData }) });
      if (res.ok) setSubmitted(true);
      else { const data = await res.json(); alert(data.error || "Erreur. Réessayez."); }
    } catch { alert("Erreur. Réessayez."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center relative z-10"><Loader2 className="w-8 h-8 animate-spin text-cyan" /></div>;
  if (notFound) return <div className="min-h-screen flex items-center justify-center relative z-10 px-6"><div className="text-center"><h1 className="text-[18px] font-semibold text-txt-primary mb-2">Brief introuvable</h1><p className="text-txt-secondary text-[13px]">Ce lien est invalide ou a expiré.</p></div></div>;

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-green" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <CheckCircle2 className="w-10 h-10 text-neon-green" />
        </div>
        <h1 className="text-[24px] font-bold text-txt-primary mb-3">Merci !</h1>
        <p className="text-txt-secondary text-[14px]">Votre brief a bien été envoyé. Nous reviendrons vers vous très rapidement.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
              <ClipboardList className="w-3.5 h-3.5 text-cyan" />
            </div>
            <span className="font-semibold text-[13px] text-txt-primary">{briefInfo?.project_name}</span>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-[11px] text-txt-muted flex items-center gap-1">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {saving ? "Sauvegarde..." : `Sauvé à ${lastSaved}`}
              </span>
            )}
            <span className="text-[11px] text-txt-ghost font-mono">{stepIndex + 1}/{WIZARD_STEPS.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / WIZARD_STEPS.length) * 100}%`, background: "linear-gradient(90deg, #06B6D4, #8B5CF6)", boxShadow: "0 0 10px rgba(6,182,212,0.4)" }} />
        </div>
      </header>

      {/* Step pills */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, i) => {
            const Icon = stepIcons[step.key] || Hand;
            return (
              <button key={step.key} onClick={() => i <= stepIndex && setCurrentStep(step.key)} disabled={i > stepIndex}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                style={step.key === currentStep
                  ? { background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#06B6D4", boxShadow: "0 0 15px rgba(6,182,212,0.1)" }
                  : i < stepIndex
                  ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10B981" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.08)", color: "#475569" }}>
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="wizard-card animate-fade-in">
          {currentStep === "welcome" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-cyan" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                <Hand className="w-8 h-8 text-cyan" />
              </div>
              <h1 className="text-[24px] font-bold text-txt-primary mb-4">Bienvenue {briefInfo?.client_name} !</h1>
              <p className="text-txt-secondary text-[14px] max-w-lg mx-auto mb-2 leading-relaxed">Ce formulaire va nous permettre de collecter tout le contenu nécessaire pour créer votre site web.</p>
              <p className="text-txt-muted text-[12px] mb-6">Comptez environ 10 minutes. Vos réponses sont sauvegardées automatiquement.</p>
              <div className="mt-6 p-5 rounded-2xl max-w-md mx-auto glass-card-glow">
                <Sparkles className="w-5 h-5 text-violet mx-auto mb-3" />
                <p className="text-[13px] text-txt-secondary mb-2">Pas le temps ? L&apos;IA peut pré-remplir vos textes.</p>
                <p className="text-[11px] text-txt-muted mb-4">Remplissez d&apos;abord l&apos;étape Entreprise, puis revenez ici.</p>
                <button onClick={handleMagicFill} disabled={magicFilling} className="btn-primary text-[12px]"
                  style={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.35)", color: "#8B5CF6", boxShadow: "0 0 20px rgba(139,92,246,0.1)" }}>
                  {magicFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {magicFilling ? "Génération..." : "Remplir avec l'IA"}
                </button>
              </div>
            </div>
          )}
          {currentStep === "business" && <StepBusiness data={formData.business_info} onChange={(k, v) => updateField("business_info", k, v)} />}
          {currentStep === "identity" && <StepIdentity data={formData.visual_identity} onChange={(k, v) => updateField("visual_identity", k, v)} />}
          {currentStep === "content" && <StepContent data={formData.content} businessName={formData.business_info.business_name} activity={formData.business_info.activity_description} onChange={(k, v) => updateField("content", k, v)} onMagicFill={handleMagicFill} magicFilling={magicFilling} />}
          {currentStep === "services" && <StepServices data={formData.content} onChange={(k, v) => updateField("content", k, v)} />}
          {currentStep === "photos" && <StepPhotos data={formData.photos} briefId={briefInfo?.id || ""} onChange={(k, v) => updateField("photos", k, v)} />}
          {currentStep === "social" && <StepSocial data={formData.social_links} onChange={(k, v) => updateField("social_links", k, v)} />}
          {currentStep === "review" && <StepReview formData={formData} onNotesChange={(notes) => setFormData(prev => ({ ...prev, additional_notes: notes }))} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pb-10">
          <button onClick={goBack} disabled={stepIndex === 0} className="btn-secondary disabled:opacity-0">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          {currentStep === "review" ? (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary cursor-pointer"
              style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.35)", color: "#10B981", boxShadow: "0 0 20px rgba(16,185,129,0.1)" }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {submitting ? "Envoi..." : "Envoyer le brief"}
            </button>
          ) : (
            <button onClick={goNext} className="btn-primary cursor-pointer">Continuer <ArrowRight className="w-4 h-4" /></button>
          )}
        </div>
      </main>
    </div>
  );
}
