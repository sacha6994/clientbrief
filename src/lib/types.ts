export interface Brief {
  id: string;
  token: string;
  client_name: string;
  client_email: string;
  project_name: string;
  status: "pending" | "in_progress" | "completed" | "archived";
  current_step: WizardStep;
  created_at: string;
  updated_at: string;
  submission?: BriefSubmission;
  draft_submission?: Partial<BriefSubmission>;
  internal_notes?: string;
}

export interface BriefSubmission {
  id: string;
  brief_id: string;
  business_info: BusinessInfo;
  visual_identity: VisualIdentity;
  content: ContentData;
  project_scope: ProjectScope;
  seo_legal: SeoLegal;
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

export interface ProjectScope {
  page_count: string;
  pages_wanted: string[];
  features: string[];
  has_domain: boolean;
  domain_name: string;
  deadline: string;
  budget: string;
  languages: string[];
  tone: "formal" | "friendly" | "casual" | "";
  competitors: string[];
}

export interface SeoLegal {
  keywords: string;
  meta_description: string;
  siret: string;
  legal_name: string;
  legal_status: string;
  privacy_contact: string;
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
  | "project"
  | "seo"
  | "photos"
  | "social"
  | "review";

export const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: "welcome", label: "Bienvenue" },
  { key: "business", label: "Votre entreprise" },
  { key: "identity", label: "Identité visuelle" },
  { key: "content", label: "Contenus textes" },
  { key: "services", label: "Services" },
  { key: "project", label: "Projet & objectifs" },
  { key: "seo", label: "SEO & légal" },
  { key: "photos", label: "Photos & médias" },
  { key: "social", label: "Réseaux sociaux" },
  { key: "review", label: "Récapitulatif" },
];

// ── Completeness scoring ────────────────────────
export function computeCompletenessScore(data: Partial<BriefSubmission> | undefined): {
  score: number;
  details: { section: string; filled: number; total: number }[];
} {
  if (!data) return { score: 0, details: [] };
  const details: { section: string; filled: number; total: number }[] = [];

  const bi = data.business_info;
  if (bi) {
    const f = [bi.business_name, bi.activity_description, bi.phone, bi.email, bi.address];
    details.push({ section: "Entreprise", filled: f.filter(Boolean).length, total: f.length });
  } else details.push({ section: "Entreprise", filled: 0, total: 5 });

  const vi = data.visual_identity;
  if (vi) {
    const f = [vi.primary_color !== "#60A5FA" || vi.secondary_color !== "#3B82F6", vi.style_preference];
    details.push({ section: "Identité", filled: f.filter(Boolean).length, total: 2 });
  } else details.push({ section: "Identité", filled: 0, total: 2 });

  const ct = data.content;
  if (ct) {
    const f = [ct.hero_title, ct.hero_subtitle, ct.about_text, ct.cta_text];
    details.push({ section: "Contenus", filled: f.filter(Boolean).length, total: f.length });
  } else details.push({ section: "Contenus", filled: 0, total: 4 });

  if (ct?.services) {
    details.push({ section: "Services", filled: Math.min(ct.services.filter(s => s.title).length, 1), total: 1 });
  } else details.push({ section: "Services", filled: 0, total: 1 });

  const ps = data.project_scope;
  if (ps) {
    const f = [ps.pages_wanted?.length > 0, ps.features?.length > 0, ps.deadline];
    details.push({ section: "Projet", filled: f.filter(Boolean).length, total: f.length });
  } else details.push({ section: "Projet", filled: 0, total: 3 });

  const sl = data.seo_legal;
  if (sl) {
    const f = [sl.keywords, sl.siret];
    details.push({ section: "SEO/Légal", filled: f.filter(Boolean).length, total: f.length });
  } else details.push({ section: "SEO/Légal", filled: 0, total: 2 });

  const ph = data.photos;
  if (ph) {
    const t = [ph.logo_files?.filter(Boolean).length || 0, ph.hero_photos?.filter(Boolean).length || 0];
    details.push({ section: "Photos", filled: t.filter(n => n > 0).length, total: 2 });
  } else details.push({ section: "Photos", filled: 0, total: 2 });

  const so = data.social_links;
  if (so) {
    details.push({ section: "Réseaux", filled: Math.min(Object.values(so).filter(Boolean).length, 1), total: 1 });
  } else details.push({ section: "Réseaux", filled: 0, total: 1 });

  const totalFilled = details.reduce((s, d) => s + d.filled, 0);
  const totalFields = details.reduce((s, d) => s + d.total, 0);
  return { score: totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0, details };
}
