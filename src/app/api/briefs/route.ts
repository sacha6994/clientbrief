import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAllBriefs, createBrief, getBriefByToken } from "@/lib/storage";
import { CreateBriefSchema } from "@/lib/validation";

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
        current_step: brief.current_step || "welcome",
        draft_submission: brief.draft_submission,
      },
    });
  }

  // Dashboard: paginated, filterable list
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
