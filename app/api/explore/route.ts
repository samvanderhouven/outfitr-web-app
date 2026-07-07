import { NextRequest, NextResponse } from "next/server";
import { getExplorePosts } from "@/lib/outfitr-api";

const MAX_LIMIT = 30;
const MAX_CURSOR_LENGTH = 200;

export async function GET(req: NextRequest) {
  const rawCursor = req.nextUrl.searchParams.get("cursor");
  const cursor =
    rawCursor && rawCursor.length <= MAX_CURSOR_LENGTH ? rawCursor : null;

  const limitParam = req.nextUrl.searchParams.get("limit");
  let limit: number | undefined;
  if (limitParam) {
    const parsed = Number(limitParam);
    if (Number.isFinite(parsed) && parsed >= 1) {
      limit = Math.min(Math.floor(parsed), MAX_LIMIT);
    }
  }

  try {
    const data = await getExplorePosts({ cursor, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("explore proxy error", error);
    return NextResponse.json(
      { success: false, message: "Kon de explore feed niet laden." },
      { status: 502 },
    );
  }
}
