"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  Loader2,
  CheckCircle2,
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

const defaultFormData = {
  business_info: {
    business_name: "",
    tagline: "",
    activity_description: "",
    target_audience: "",
    unique_selling_point: "",
    address: "",
    phone: "",
    email: "",
    opening_hours: "",
  },
  visual_identity: {
    has_logo: false,
    logo_url: "",
    primary_color: "#0c93e7",
    secondary_color: "#072a49",
    accent_color: "#f59e0b",
    style_preference: "modern" as const,
    reference_websites: [""],
  },
  content: {
    hero_title: "",
    hero_subtitle: "",
    about_text: "",
    services: [{ id: "1", title: "", description: "", price: "" }],
    testimonials: [{ id: "1", author: "", text: "", rating: 5 }],
    cta_text: "",
  },
  social_links: {
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    google_maps: "",
    website_current: "",
  },
  photos: {
    logo_files: [] as string[],
    hero_photos: [] as string[],
    gallery_photos: [] as string[],
    team_photos: [] as string[],
  },
  additional_notes: "",
};

export type FormData = typeof defaultFormData;

export default function BriefWizardPage() {
  const params = useParams();
  const token = params.token as string;

  const [briefInfo, setBriefInfo] = useState<{
    id: string;
    project_name: string;
    client_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome");
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadBrief = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefs?token=${token}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      if (data.brief) {
        setBriefInfo(data.brief);
        if (data.brief.status === "completed") {
          setSubmitted(true);
        }
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBrief();
  }, [loadBrief]);

  const stepIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  const goNext = () => {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[stepIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[stepIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateField = (section: keyof FormData, key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/briefs/${briefInfo?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission: formData }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-2">
            Brief introuvable
          </h1>
          <p className="text-surface-500">
            Ce lien est invalide ou a expiré.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">
            Merci ! 🎉
          </h1>
          <p className="text-surface-500 text-lg">
            Votre brief a bien été envoyé. Nous reviendrons vers vous très
            rapidement avec une proposition.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-surface-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <ClipboardList className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm">
              {briefInfo?.project_name}
            </span>
          </div>
          <span className="text-xs text-surface-400 font-mono">
            {stepIndex + 1} / {WIZARD_STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface-100">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out"
            style={{
              width: `${((stepIndex + 1) / WIZARD_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Step navigation pills */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {WIZARD_STEPS.map((step, i) => (
            <button
              key={step.key}
              onClick={() => i <= stepIndex && setCurrentStep(step.key)}
              disabled={i > stepIndex}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                step.key === currentStep
                  ? "bg-brand-600 text-white shadow-md"
                  : i < stepIndex
                  ? "bg-brand-50 text-brand-700 hover:bg-brand-100 cursor-pointer"
                  : "bg-surface-100 text-surface-400 cursor-not-allowed"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="wizard-card animate-fade-in">
          {currentStep === "welcome" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">👋</div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Bienvenue {briefInfo?.client_name} !
              </h1>
              <p className="text-surface-500 text-lg max-w-lg mx-auto mb-2 leading-relaxed">
                Ce formulaire va nous permettre de collecter tout le contenu
                nécessaire pour créer votre site web.
              </p>
              <p className="text-surface-400 text-sm">
                Comptez environ 10 minutes. Vous pouvez revenir dessus plus tard.
              </p>
            </div>
          )}

          {currentStep === "business" && (
            <StepBusiness
              data={formData.business_info}
              onChange={(key, val) => updateField("business_info", key, val)}
            />
          )}

          {currentStep === "identity" && (
            <StepIdentity
              data={formData.visual_identity}
              onChange={(key, val) => updateField("visual_identity", key, val)}
            />
          )}

          {currentStep === "content" && (
            <StepContent
              data={formData.content}
              businessName={formData.business_info.business_name}
              activity={formData.business_info.activity_description}
              onChange={(key, val) => updateField("content", key, val)}
            />
          )}

          {currentStep === "services" && (
            <StepServices
              data={formData.content}
              onChange={(key, val) => updateField("content", key, val)}
            />
          )}

          {currentStep === "photos" && (
            <StepPhotos
              data={formData.photos}
              onChange={(key, val) => updateField("photos", key, val)}
            />
          )}

          {currentStep === "social" && (
            <StepSocial
              data={formData.social_links}
              onChange={(key, val) => updateField("social_links", key, val)}
            />
          )}

          {currentStep === "review" && (
            <StepReview formData={formData} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pb-10">
          <button
            onClick={goBack}
            disabled={stepIndex === 0}
            className="btn-secondary disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          {currentStep === "review" ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-600/25"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {submitting ? "Envoi en cours..." : "Envoyer le brief"}
            </button>
          ) : (
            <button onClick={goNext} className="btn-primary">
              Continuer
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
