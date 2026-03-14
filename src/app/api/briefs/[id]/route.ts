import { NextRequest, NextResponse } from "next/server";
import { getBriefById, updateBriefSubmission, deleteBrief } from "@/lib/storage";
import { BriefSubmissionSchema } from "@/lib/validation";
import { sendBriefSubmittedNotification } from "@/lib/email";
import { computeCompletenessScore } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const brief = await getBriefById(params.id);
  if (!brief) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }
  return NextResponse.json({ brief });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { submission } = body;

    if (!submission) {
      return NextResponse.json({ error: "Missing submission data" }, { status: 400 });
    }

    const parsed = BriefSubmissionSchema.safeParse(submission);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const brief = await updateBriefSubmission(params.id, parsed.data);
    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    // Send notification email to agency (non-blocking)
    const { score } = computeCompletenessScore(parsed.data);
    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/brief\/.*$/, "") || "";
    sendBriefSubmittedNotification({
      clientName: brief.client_name,
      clientEmail: brief.client_email,
      projectName: brief.project_name,
      dashboardUrl: `${origin}/dashboard`,
      completenessScore: score,
    }).catch(() => {}); // Fire and forget

    return NextResponse.json({ brief });
  } catch (error) {
    console.error("Update brief error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteBrief(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
