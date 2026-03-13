import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { businessName, activity, field, prompt } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `Tu es un copywriter professionnel français spécialisé dans la création de sites vitrines pour des commerces et entreprises locales. Tu génères des textes courts, percutants et adaptés au web. Tu écris en français courant, chaleureux mais professionnel. Tu ne mets PAS de guillemets autour du texte généré. Tu réponds UNIQUEMENT avec le texte demandé, sans explication ni commentaire.`;

    const userPrompt = `Entreprise : ${businessName || "Non renseigné"}
Activité : ${activity || "Non renseignée"}

${prompt}

Réponds uniquement avec le texte demandé, rien d'autre.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return NextResponse.json({ text, field });
  } catch (error) {
    console.error("Generate text error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
