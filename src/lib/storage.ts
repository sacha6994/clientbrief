import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Brief, WizardStep } from "./types";

let clientInstance: SupabaseClient | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getClient(): SupabaseClient<any> {
  if (clientInstance) return clientInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials not configured.");
  }

  clientInstance = createClient(url, key);
  return clientInstance;
}

// ── Read operations ─────────────────────────────

export async function getAllBriefs(options?: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ briefs: Brief[]; total: number }> {
  const supabase = getClient();
  const { search, status, limit = 50, offset = 0 } = options || {};

  let query = supabase
    .from("briefs")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `client_name.ilike.%${search}%,project_name.ilike.%${search}%,client_email.ilike.%${search}%`
    );
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getAllBriefs error:", error);
    return { briefs: [], total: 0 };
  }

  return { briefs: (data as Brief[]) || [], total: count || 0 };
}

export async function getBriefById(id: string): Promise<Brief | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getBriefById error:", error);
    return null;
  }
  return data as Brief;
}

export async function getBriefByToken(token: string): Promise<Brief | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("token", token)
    .single();

  if (error) {
    console.error("getBriefByToken error:", error);
    return null;
  }
  return data as Brief;
}

// ── Write operations ────────────────────────────

export async function createBrief(
  briefData: Pick<Brief, "token" | "client_name" | "client_email" | "project_name">
): Promise<Brief> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .insert({
      token: briefData.token,
      client_name: briefData.client_name,
      client_email: briefData.client_email,
      project_name: briefData.project_name,
      status: "pending",
      current_step: "welcome",
    })
    .select()
    .single();

  if (error) {
    console.error("createBrief error:", error);
    throw new Error("Failed to create brief");
  }
  return data as Brief;
}

export async function updateBriefSubmission(
  id: string,
  submission: Record<string, unknown>
): Promise<Brief | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .update({
      status: "completed",
      submission,
      current_step: "review",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBriefSubmission error:", error);
    return null;
  }
  return data as Brief;
}

export async function saveDraft(
  id: string,
  draftSubmission: Record<string, unknown>,
  currentStep: WizardStep
): Promise<Brief | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .update({
      status: "in_progress",
      draft_submission: draftSubmission,
      current_step: currentStep,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("saveDraft error:", error);
    return null;
  }
  return data as Brief;
}

export async function deleteBrief(id: string): Promise<boolean> {
  const supabase = getClient();
  const { error } = await supabase
    .from("briefs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteBrief error:", error);
    return false;
  }
  return true;
}

// ── File upload ─────────────────────────────────

export async function uploadFile(
  briefId: string,
  fileName: string,
  fileBuffer: ArrayBuffer,
  contentType: string
): Promise<string | null> {
  const supabase = getClient();
  const path = `${briefId}/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from("brief-uploads")
    .upload(path, fileBuffer, {
      contentType,
      cacheControl: "3600",
    });

  if (error) {
    console.error("uploadFile error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("brief-uploads")
    .getPublicUrl(path);

  return urlData.publicUrl;
}
