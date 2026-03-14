import { NextRequest, NextResponse } from "next/server";
import { createSession, getSessionCookieConfig, getDashboardPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success } = rateLimit(`auth:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    const expected = getDashboardPassword();
    if (password !== expected) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    const session = await createSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(getSessionCookieConfig(session));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
