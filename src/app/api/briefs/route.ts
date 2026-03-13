import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAllBriefs, createBrief, getBriefByToken } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // If token provided, return single brief (for client wizard)
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
      },
    });
  }

  // Return all briefs for dashboard
  const briefs = await getAllBriefs();
  return NextResponse.json({ briefs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_name, client_email, project_name } = body;

    if (!client_name || !client_email || !project_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = nanoid(12);
    const brief = await createBrief({
      token,
      client_name,
      client_email,
      project_name,
    });

    return NextResponse.json({ brief }, { status: 201 });
  } catch (error) {
    console.error("Create brief error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
