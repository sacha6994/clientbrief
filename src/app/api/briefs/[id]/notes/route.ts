import { NextRequest, NextResponse } from "next/server";
import { updateInternalNotes } from "@/lib/storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { notes } = await request.json();

    if (typeof notes !== "string" || notes.length > 5000) {
      return NextResponse.json({ error: "Invalid notes" }, { status: 400 });
    }

    const success = await updateInternalNotes(params.id, notes);
    if (!success) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
