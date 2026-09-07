import { NextRequest, NextResponse } from "next/server";
import { OutfitrApiError, getUserPosts } from "@/lib/outfitr-api";
import { decodeHandle } from "@/lib/profile-utils";

const MAX_LIMIT = 30;
const MAX_CURSOR_LENGTH = 200;
const MAX_HANDLE_LENGTH = 64;

/**
 * Pagination proxy for the profile grid — the browser counterpart of the
 * server-rendered first page. Mirrors /api/explore: it keeps the upstream base
 * URL server-side and bounds the inputs.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle: rawHandle } = await params;
  // App Router params arrive percent-encoded — decode before re-encoding
  // upstream, or a handle with a space becomes "Tim%2520Pennock".
  const handle = decodeHandle(rawHandle);

  if (!handle || handle.length > MAX_HANDLE_LENGTH) {
    return NextResponse.json(
      { posts: [], nextCursor: null, hasMore: false },
      { status: 400 },
    );
  }

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
    const data = await getUserPosts(handle, { cursor, limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("user posts proxy error", error);
    const status =
      error instanceof OutfitrApiError && error.isNotFound ? 404 : 502;
    return NextResponse.json(
      { posts: [], nextCursor: null, hasMore: false },
      { status },
    );
  }
}
