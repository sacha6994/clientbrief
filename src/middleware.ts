import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/api/briefs/:path*"],
};

async function hmacVerify(token: string, secret: string): Promise<boolean> {
  try {
    const [timestamp, sig] = token.split(".");
    if (!timestamp || !sig) return false;

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) return false;

    // 7-day expiry
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
    const expectedSig = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return sig === expectedSig;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public API endpoints: token-based brief access + autosave (used by clients)
  if (pathname.startsWith("/api/briefs") && request.method === "GET") {
    const url = new URL(request.url);
    if (url.searchParams.has("token")) {
      return NextResponse.next();
    }
  }

  // Allow PUT on /api/briefs/[id] (client submission) and autosave
  if (
    pathname.match(/^\/api\/briefs\/[^/]+$/) &&
    (request.method === "PUT")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.match(/^\/api\/briefs\/[^/]+\/autosave$/) &&
    request.method === "PUT"
  ) {
    return NextResponse.next();
  }

  // Check auth for dashboard + admin API routes
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    // No password configured = no auth required (dev mode)
    return NextResponse.next();
  }

  const session = request.cookies.get("cb_session")?.value;
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const valid = await hmacVerify(session, password);
  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("cb_session");
    return response;
  }

  return NextResponse.next();
}
