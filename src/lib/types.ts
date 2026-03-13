export interface Brief {
  id: string;
  token: string;
  client_name: string;
  client_email: string;
  project_name: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
  submission?: BriefSubmission;
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
