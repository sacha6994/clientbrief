import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { duplicateBrief } from "@/lib/storage";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const newToken = nanoid(12);
  const brief = await duplicateBrief(params.id, newToken);
  if (!brief) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }
  return NextResponse.json({ brief }, { status: 201 });
}
