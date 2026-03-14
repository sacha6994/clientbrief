import { NextRequest, NextResponse } from "next/server";
import { archiveBrief } from "@/lib/storage";

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = await archiveBrief(params.id);
  if (!success) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
