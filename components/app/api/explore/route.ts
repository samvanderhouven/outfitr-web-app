import { NextRequest, NextResponse } from "next/server";
import { getExplorePosts } from "@/lib/outfitr-api";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

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
