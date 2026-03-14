export interface Brief {
  id: string;
  token: string;
  client_name: string;
  client_email: string;
  project_name: string;
  status: "pending" | "in_progress" | "completed";
  current_step: WizardStep;
  created_at: string;
  updated_at: string;
  submission?: BriefSubmission;
  draft_submission?: Partial<BriefSubmission>;
}

export interface BriefSubmission {
  id: string;
  brief_id: string;
  business_info: BusinessInfo;
  visual_identity: VisualIdentity;
  content: ContentData;
  social_links: SocialLinks;
  photos: PhotoData;
  additional_notes: string;
  submitted_at: string;
}

export interface BusinessInfo {
  business_name: string;
  tagline: string;
  activity_description: string;
  target_audience: string;
  unique_selling_point: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: string;
}

export interface VisualIdentity {
  has_logo: boolean;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  style_preference: "modern" | "classic" | "bold" | "minimal" | "luxury" | "playful";
  reference_websites: string[];
}

export interface ContentData {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  cta_text: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  text: string;
  rating: number;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  google_maps: string;
  website_current: string;
}

export interface PhotoData {
  logo_files: string[];
  hero_photos: string[];
  gallery_photos: string[];
  team_photos: string[];
}

export type WizardStep =
  | "welcome"
  | "business"
  | "identity"
  | "content"
  | "services"
  | "photos"
  | "social"
  | "review";

export const WIZARD_STEPS: { key: WizardStep; label: string; icon: string }[] = [
  { key: "welcome", label: "Bienvenue", icon: "👋" },
  { key: "business", label: "Votre entreprise", icon: "🏢" },
  { key: "identity", label: "Identité visuelle", icon: "🎨" },
  { key: "content", label: "Contenus textes", icon: "✍️" },
  { key: "services", label: "Services", icon: "⚡" },
  { key: "photos", label: "Photos & médias", icon: "📸" },
  { key: "social", label: "Réseaux sociaux", icon: "🔗" },
  { key: "review", label: "Récapitulatif", icon: "✅" },
];

// ── Completeness scoring ────────────────────────
export function computeCompletenessScore(data: Partial<BriefSubmission> | undefined): {
  score: number;
  details: { section: string; filled: number; total: number }[];
} {
  if (!data) return { score: 0, details: [] };

  const details: { section: string; filled: number; total: number }[] = [];

  // Business info
  const bi = data.business_info;
  if (bi) {
    const fields = [bi.business_name, bi.activity_description, bi.phone, bi.email, bi.address];
    details.push({ section: "Entreprise", filled: fields.filter(Boolean).length, total: fields.length });
  } else {
    details.push({ section: "Entreprise", filled: 0, total: 5 });
  }

  // Visual identity
  const vi = data.visual_identity;
  if (vi) {
    const fields = [vi.primary_color !== "#0c93e7" || vi.secondary_color !== "#072a49", vi.style_preference];
    details.push({ section: "Identité", filled: fields.filter(Boolean).length, total: 2 });
  } else {
    details.push({ section: "Identité", filled: 0, total: 2 });
  }

  // Content
  const ct = data.content;
  if (ct) {
    const fields = [ct.hero_title, ct.hero_subtitle, ct.about_text, ct.cta_text];
    details.push({ section: "Contenus", filled: fields.filter(Boolean).length, total: fields.length });
  } else {
    details.push({ section: "Contenus", filled: 0, total: 4 });
  }

  // Services
  if (ct?.services) {
    const filled = ct.services.filter((s) => s.title).length;
    details.push({ section: "Services", filled: Math.min(filled, 1), total: 1 });
  } else {
    details.push({ section: "Services", filled: 0, total: 1 });
  }

  // Photos
  const ph = data.photos;
  if (ph) {
    const total = [
      ph.logo_files?.filter(Boolean).length || 0,
      ph.hero_photos?.filter(Boolean).length || 0,
    ];
    details.push({ section: "Photos", filled: total.filter((n) => n > 0).length, total: 2 });
  } else {
    details.push({ section: "Photos", filled: 0, total: 2 });
  }

  // Social
  const sl = data.social_links;
  if (sl) {
    const filled = Object.values(sl).filter(Boolean).length;
    details.push({ section: "Réseaux", filled: Math.min(filled, 1), total: 1 });
  } else {
    details.push({ section: "Réseaux", filled: 0, total: 1 });
  }

  const totalFilled = details.reduce((sum, d) => sum + d.filled, 0);
  const totalFields = details.reduce((sum, d) => sum + d.total, 0);
  const score = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0;

  return { score, details };
}
