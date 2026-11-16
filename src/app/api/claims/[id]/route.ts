import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth, error } from "@/lib/http";
import { db, getClaim, saveClaim, newCapture } from "@/lib/store";
import { canReview } from "@/lib/domain";
import { prepareImage } from "@/lib/upload";
type Ctx = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const org = auth(req);
    const c = getClaim((await ctx.params).id, org);
    return c ? NextResponse.json(c) : error("접수를 찾을 수 없습니다.", 404);
  } catch (e) {
    return error((e as Error).message, 401);
  }
}
export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const org = auth(req);
    const id = (await ctx.params).id;
    let c = getClaim(id, org);
    if (!c) return error("접수를 찾을 수 없습니다.", 404);
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const f = (await req.formData()).get("file");
      if (!(f instanceof File)) return error("사진을 선택해 주세요.");
      const content = await prepareImage(f);
      c = getClaim(id, org)!;
      if (
        c.status === "resolved" ||
        c.assets.filter((a) => a.side === "outgoing").length >= 4
      )
        return error(
          "출고 사진은 검토 완료 전 최대 4장까지 등록할 수 있습니다.",
        );
      const aid = randomUUID();
      const now = new Date().toISOString();
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare("INSERT INTO assets VALUES (?,?,?,?)").run(
          aid,
          id,
          content,
          "image/jpeg",
        );
        c.assets.push({
          id: aid,
          side: "outgoing",
          label: "출고 사진",
          url: "/api/assets/" + aid,
          createdAt: now,
        });
        c.version++;
        c.events.push({ text: "출고 사진이 등록되었습니다.", at: now });
        saveClaim(c);
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
      return NextResponse.json(c);
    }
    const body = await req.json();
    if (body.action === "link") {
      if (c.status === "resolved")
        return error("완료된 접수에는 링크를 발급할 수 없습니다.");
      return NextResponse.json({ token: newCapture(id) });
    }
    if (body.action === "review") {
      if (!canReview(c.status))
        return error("고객 자료 접수 후 검토할 수 있습니다.", 409);
      if (body.version !== c.version)
        return error(
          "접수가 변경되었습니다. 새로고침 후 다시 확인해 주세요.",
          409,
        );
      if (
        !["resolved", "needs_more_evidence"].includes(body.status) ||
        typeof body.note !== "string" ||
        !body.note.trim() ||
        body.note.length > 2000
      )
        return error("처리 사유를 2,000자 이내로 입력해 주세요.");
      c.status = body.status;
      c.note = body.note.trim();
      c.version++;
      c.events.push({
        text:
          (c.status === "resolved" ? "검토 완료: " : "추가 자료 요청: ") +
          c.note,
        at: new Date().toISOString(),
      });
      saveClaim(c);
      return NextResponse.json(c);
    }
    return error("지원하지 않는 요청입니다.");
  } catch (e) {
    return error((e as Error).message);
  }
}
