import { NextRequest, NextResponse } from "next/server";
import { getBriefById, updateBriefSubmission, deleteBrief } from "@/lib/storage";

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
      return NextResponse.json(
        { error: "Missing submission data" },
        { status: 400 }
      );
    }

    const brief = await updateBriefSubmission(params.id, submission);
    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    return NextResponse.json({ brief });
  } catch (error) {
    console.error("Update brief error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
