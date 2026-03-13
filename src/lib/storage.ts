import { createClient } from "@supabase/supabase-js";
import type { Brief } from "./types";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, key);
}

export async function getAllBriefs(): Promise<Brief[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBriefs error:", error);
    return [];
  }
  return data || [];
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
  return data;
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
  return data;
}

export async function createBrief(
  briefData: Omit<Brief, "id" | "created_at" | "updated_at" | "status" | "submission">
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
    })
    .select()
    .single();

  if (error) {
    console.error("createBrief error:", error);
    throw new Error("Failed to create brief");
  }
  return data;
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
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBriefSubmission error:", error);
    return null;
  }
  return data;
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
