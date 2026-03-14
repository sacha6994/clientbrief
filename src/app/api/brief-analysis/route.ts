import { NextRequest, NextResponse } from "next/server";
import { sanitizeForPrompt } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { computeCompletenessScore } from "@/lib/types";
import type { BriefSubmission } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(`analysis:${ip}`, 10, 60_000);
    if (!success) {
      return NextResponse.json(
        { error: "Trop de requêtes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { submission } = body as { submission: BriefSubmission };

    if (!submission) {
      return NextResponse.json({ error: "Missing submission" }, { status: 400 });
    }

    const { score, details } = computeCompletenessScore(submission);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return score without AI suggestions
      return NextResponse.json({ score, details, suggestions: [] });
    }

    const safeName = sanitizeForPrompt(submission.business_info?.business_name || "");
    const safeActivity = sanitizeForPrompt(submission.business_info?.activity_description || "");

    const systemPrompt = `Tu es un consultant web expert. Tu analyses des briefs clients et donnes des suggestions d'amélioration concrètes. Réponds en JSON uniquement.`;

    const userPrompt = `[BRIEF CLIENT]
Entreprise: ${safeName}
Activité: ${safeActivity}
Score de complétude: ${score}%
Titre hero: ${submission.content?.hero_title ? "Fourni" : "Manquant"}
Sous-titre: ${submission.content?.hero_subtitle ? "Fourni" : "Manquant"}
À propos: ${submission.content?.about_text ? "Fourni" : "Manquant"}
CTA: ${submission.content?.cta_text ? "Fourni" : "Manquant"}
Services: ${submission.content?.services?.filter((s) => s.title).length || 0}
Témoignages: ${submission.content?.testimonials?.filter((t) => t.author).length || 0}
Photos: ${[
      submission.photos?.logo_files?.filter(Boolean).length || 0,
      submission.photos?.hero_photos?.filter(Boolean).length || 0,
      submission.photos?.gallery_photos?.filter(Boolean).length || 0,
    ].reduce((a, b) => a + b, 0)}
Réseaux sociaux: ${Object.values(submission.social_links || {}).filter(Boolean).length}

Génère un JSON avec :
{
  "suggestions": [
    { "priority": "high|medium|low", "section": "nom de section", "message": "suggestion concrète" }
  ],
  "estimated_dev_hours": number,
  "site_structure": ["Page 1", "Page 2", ...]
}
Limite à 5 suggestions max.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ score, details, suggestions: [] });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ score, details, suggestions: [] });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ score, details, ...analysis });
  } catch (error) {
    console.error("Brief analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
