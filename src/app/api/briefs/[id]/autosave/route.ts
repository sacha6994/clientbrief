import { NextRequest, NextResponse } from "next/server";
import { saveDraft } from "@/lib/storage";
import { AutosaveSchema } from "@/lib/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = AutosaveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const brief = await saveDraft(
      params.id,
      parsed.data.draft_submission as Record<string, unknown>,
      parsed.data.current_step
    );

    if (!brief) {
      return NextResponse.json({ error: "Brief not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Autosave error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
