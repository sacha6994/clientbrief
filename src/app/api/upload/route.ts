import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(`upload:${ip}`, 30, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Trop d'uploads. Réessayez dans une minute." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const briefId = formData.get("briefId") as string | null;

    if (!file || !briefId) {
      return NextResponse.json(
        { error: "Fichier et briefId requis" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Formats acceptés : JPG, PNG, WebP, SVG, GIF, PDF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );
    }

    // Sanitize filename
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .substring(0, 100);

    const buffer = await file.arrayBuffer();
    const url = await uploadFile(briefId, safeName, buffer, file.type);

    if (!url) {
      return NextResponse.json(
        { error: "Échec de l'upload" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
