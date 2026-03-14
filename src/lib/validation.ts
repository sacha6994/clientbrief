import { z } from "zod";

// ── Brief creation ──────────────────────────────
export const CreateBriefSchema = z.object({
  client_name: z.string().min(1, "Nom requis").max(255).trim(),
  client_email: z.string().email("Email invalide").max(255).trim(),
  project_name: z.string().min(1, "Nom du projet requis").max(255).trim(),
});

// ── Business info ───────────────────────────────
export const BusinessInfoSchema = z.object({
  business_name: z.string().max(255).default(""),
  tagline: z.string().max(500).default(""),
  activity_description: z.string().max(2000).default(""),
  target_audience: z.string().max(500).default(""),
  unique_selling_point: z.string().max(1000).default(""),
  address: z.string().max(500).default(""),
  phone: z.string().max(30).default(""),
  email: z.string().max(255).default(""),
  opening_hours: z.string().max(500).default(""),
});

// ── Visual identity ─────────────────────────────
export const VisualIdentitySchema = z.object({
  has_logo: z.boolean().default(false),
  logo_url: z.string().max(2000).default(""),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0c93e7"),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#072a49"),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#f59e0b"),
  style_preference: z.enum(["modern", "classic", "bold", "minimal", "luxury", "playful"]).default("modern"),
  reference_websites: z.array(z.string().max(2000)).max(10).default([""]),
});

// ── Content ─────────────────────────────────────
export const ServiceItemSchema = z.object({
  id: z.string(),
  title: z.string().max(255).default(""),
  description: z.string().max(1000).default(""),
  price: z.string().max(50).optional().default(""),
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  author: z.string().max(255).default(""),
  text: z.string().max(1000).default(""),
  rating: z.number().min(1).max(5).default(5),
});

export const ContentDataSchema = z.object({
  hero_title: z.string().max(500).default(""),
  hero_subtitle: z.string().max(500).default(""),
  about_text: z.string().max(3000).default(""),
  services: z.array(ServiceItemSchema).max(20).default([]),
  testimonials: z.array(TestimonialItemSchema).max(20).default([]),
  cta_text: z.string().max(255).default(""),
});

// ── Social links ────────────────────────────────
export const SocialLinksSchema = z.object({
  facebook: z.string().max(500).default(""),
  instagram: z.string().max(500).default(""),
  tiktok: z.string().max(500).default(""),
  linkedin: z.string().max(500).default(""),
  google_maps: z.string().max(500).default(""),
  website_current: z.string().max(500).default(""),
});

// ── Photos ──────────────────────────────────────
export const PhotoDataSchema = z.object({
  logo_files: z.array(z.string().max(2000)).max(5).default([]),
  hero_photos: z.array(z.string().max(2000)).max(10).default([]),
  gallery_photos: z.array(z.string().max(2000)).max(30).default([]),
  team_photos: z.array(z.string().max(2000)).max(10).default([]),
});

// ── Full submission ─────────────────────────────
export const BriefSubmissionSchema = z.object({
  business_info: BusinessInfoSchema,
  visual_identity: VisualIdentitySchema,
  content: ContentDataSchema,
  social_links: SocialLinksSchema,
  photos: PhotoDataSchema,
  additional_notes: z.string().max(3000).default(""),
});

// ── Generate text ───────────────────────────────
export const GenerateTextSchema = z.object({
  businessName: z.string().max(255).default(""),
  activity: z.string().max(500).default(""),
  field: z.string().max(100),
  prompt: z.string().max(500),
});

// ── Autosave ────────────────────────────────────
export const AutosaveSchema = z.object({
  draft_submission: BriefSubmissionSchema.partial(),
  current_step: z.enum([
    "welcome", "business", "identity", "content",
    "services", "photos", "social", "review",
  ]),
});

// ── Sanitize text for AI prompts ────────────────
export function sanitizeForPrompt(input: string): string {
  return input
    .substring(0, 500)
    .replace(/[\r\n]+/g, " ")
    .replace(/[<>{}]/g, "")
    .trim();
}
