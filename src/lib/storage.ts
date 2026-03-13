import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Brief, BriefSubmission } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const BRIEFS_FILE = path.join(DATA_DIR, "briefs.json");

async function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readBriefs(): Promise<Brief[]> {
  await ensureDir();
  try {
    const raw = await readFile(BRIEFS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeBriefs(briefs: Brief[]) {
  await ensureDir();
  await writeFile(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
}

export async function getAllBriefs(): Promise<Brief[]> {
  return readBriefs();
}

export async function getBriefById(id: string): Promise<Brief | null> {
  const briefs = await readBriefs();
  return briefs.find((b) => b.id === id) || null;
}

export async function getBriefByToken(token: string): Promise<Brief | null> {
  const briefs = await readBriefs();
  return briefs.find((b) => b.token === token) || null;
}

export async function createBrief(
  data: Omit<Brief, "id" | "created_at" | "updated_at" | "status" | "submission">,
): Promise<Brief> {
  const briefs = await readBriefs();
  const now = new Date().toISOString();
  const brief: Brief = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    created_at: now,
    updated_at: now,
  };
  briefs.push(brief);
  await writeBriefs(briefs);
  return brief;
}

export async function updateBriefSubmission(
  id: string,
  submission: Omit<BriefSubmission, "id" | "brief_id" | "submitted_at">,
): Promise<Brief | null> {
  const briefs = await readBriefs();
  const index = briefs.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  briefs[index] = {
    ...briefs[index],
    status: "completed",
    updated_at: now,
    submission: {
      ...submission,
      id: crypto.randomUUID(),
      brief_id: id,
      submitted_at: now,
    } as BriefSubmission,
  };

  await writeBriefs(briefs);
  return briefs[index];
}

export async function deleteBrief(id: string): Promise<boolean> {
  const briefs = await readBriefs();
  const filtered = briefs.filter((b) => b.id !== id);
  if (filtered.length === briefs.length) return false;
  await writeBriefs(filtered);
  return true;
}
