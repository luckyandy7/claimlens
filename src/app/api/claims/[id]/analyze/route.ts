import { NextRequest, NextResponse } from "next/server";
import { auth, error } from "@/lib/http";
import { getClaim, saveClaim } from "@/lib/store";
import { analyzeClaim } from "@/lib/analysis";
export const runtime = "nodejs";
const locks = new Set<string>();
const recent = new Map<string, number>();
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  let org: string;
  try {
    org = auth(req);
  } catch {
    return error("작업공간을 먼저 열어 주세요.", 401);
  }
  const { id } = await ctx.params;
  const c = getClaim(id, org);
  if (!c) return error("접수를 찾을 수 없습니다.", 404);
  if (c.status === "resolved")
    return error("완료된 접수는 분석할 수 없습니다.", 409);
  if (locks.has(org) || Date.now() - (recent.get(org) ?? 0) < 15000)
    return error(
      "분석 중이거나 요청이 너무 빠릅니다. 잠시 후 다시 시도해 주세요.",
      429,
    );
  locks.add(org);
  recent.set(org, Date.now());
  try {
    const analysis = await analyzeClaim(c);
    const latest = getClaim(id, org);
    if (!latest || latest.version !== c.version)
      return error(
        "분석 중 접수가 변경되었습니다. 새로고침 후 다시 분석해 주세요.",
        409,
      );
    latest.analysis = analysis;
    latest.version++;
    latest.events.push({
      text: "AI 사진 비교 분석을 실행했습니다. 최종 판단은 담당자가 수행합니다.",
      at: analysis.createdAt,
    });
    saveClaim(latest);
    return NextResponse.json(latest);
  } catch (e) {
    return error(
      e instanceof Error && e.name === "TimeoutError"
        ? "분석 시간이 초과되었습니다. 다시 시도해 주세요."
        : (e as Error).message,
      502,
    );
  } finally {
    locks.delete(org);
  }
}
