import { cookies } from "next/headers";

const SESSION_COOKIE = "cb_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getDashboardPassword(): string {
  const pw = process.env.DASHBOARD_PASSWORD;
  if (!pw) {
    throw new Error("DASHBOARD_PASSWORD not configured");
  }
  return pw;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const bytes = new Uint8Array(signature);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSession(): Promise<string> {
  const password = getDashboardPassword();
  const timestamp = Date.now().toString();
  const sig = await hmacSign(timestamp, password);
  return `${timestamp}.${sig}`;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const password = getDashboardPassword();
    const [timestamp, sig] = token.split(".");
    if (!timestamp || !sig) return false;

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) return false;

    // Expire after max age
    if (Date.now() - ts > SESSION_MAX_AGE * 1000) return false;

    const expectedSig = await hmacSign(timestamp, password);
    return sig === expectedSig;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) return false;
    return verifySession(session.value);
  } catch {
    return false;
  }
}

export function getSessionCookieConfig(value: string) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export function getLogoutCookieConfig() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
