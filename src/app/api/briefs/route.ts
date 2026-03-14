import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAllBriefs, createBrief, getBriefByToken } from "@/lib/storage";
import { CreateBriefSchema } from "@/lib/validation";
import { sendBriefLinkEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token) {
    const brief = await getBriefByToken(token);
    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }
    return NextResponse.json({
      brief: {
        id: brief.id,
        project_name: brief.project_name,
        client_name: brief.client_name,
        status: brief.status,
        current_step: brief.current_step || "welcome",
        draft_submission: brief.draft_submission,
      },
    });
  }

  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const result = await getAllBriefs({ search, status, limit, offset });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateBriefSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { client_name, client_email, project_name } = parsed.data;
    const sendEmail = body.send_email !== false; // default true
    const token = nanoid(12);

    const brief = await createBrief({ token, client_name, client_email, project_name });

    // Send email to client with brief link (non-blocking)
    let emailSent = false;
    if (sendEmail) {
      const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/[^/]*$/, "") || "";
      const briefUrl = `${origin}/brief/${token}`;
      emailSent = await sendBriefLinkEmail({
        clientName: client_name,
        clientEmail: client_email,
        projectName: project_name,
        briefUrl,
      });
    }

    return NextResponse.json({ brief, emailSent }, { status: 201 });
  } catch (error) {
    console.error("Create brief error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
