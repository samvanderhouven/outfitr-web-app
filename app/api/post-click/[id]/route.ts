import { NextRequest, NextResponse } from "next/server";
import { registerPostClick } from "@/lib/outfitr-api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: {
    brandId?: string;
    mediaIndex?: number;
    referrer?: string;
    metaData?: Record<string, unknown>;
  } = {};

  try {
    body = await req.json();
  } catch {
    // No body provided, fall back to defaults.
  }

  try {
    await registerPostClick(id, {
      brandId: body.brandId,
      mediaIndex: body.mediaIndex,
      referrer: body.referrer ?? req.headers.get("referer") ?? "",
      metaData: body.metaData,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    // Click tracking should never break the page for the visitor.
    console.error("post click proxy error", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
