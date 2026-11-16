import { NextRequest } from "next/server";
import { auth, error } from "@/lib/http";
import { db, getClaim } from "@/lib/store";
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const org = auth(req);
    const row = db
      .prepare("SELECT * FROM assets WHERE id=?")
      .get((await ctx.params).id) as
      { claim_id: string; content: Uint8Array; type: string } | undefined;
    if (!row || !getClaim(row.claim_id, org))
      return error("사진을 찾을 수 없습니다.", 404);
    return new Response(new Uint8Array(row.content), {
      headers: {
        "Content-Type": row.type,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    return error((e as Error).message, 401);
  }
}
