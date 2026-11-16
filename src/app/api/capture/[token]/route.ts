import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { localGuard, error } from "@/lib/http";
import { captureFor, getClaim, saveClaim, db, hash } from "@/lib/store";
import { prepareImage } from "@/lib/upload";
type Ctx = { params: Promise<{ token: string }> };
export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    localGuard(req);
    const s = captureFor((await ctx.params).token);
    if (!s)
      return error(
        "링크가 만료되었거나 유효하지 않습니다. 판매자에게 새 링크를 요청해 주세요.",
        404,
      );
    const c = getClaim(s.claim_id)!;
    return NextResponse.json({
      product: c.product,
      order: c.order,
      submitted: !!s.used,
    });
  } catch (e) {
    return error((e as Error).message);
  }
}
export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    localGuard(req);
    const token = (await ctx.params).token;
    const session = captureFor(token);
    if (!session || session.used)
      return error("만료되었거나 이미 제출된 링크입니다.", 409);
    const form = await req.formData();
    const files = ["전체 모습", "문제 부위", "제품 식별정보"].map(
      (label, i) => ({ label, file: form.get("photo" + i) }),
    );
    if (files.some((x) => !(x.file instanceof File)))
      return error("안내된 사진 3장을 등록해 주세요.");
    const prepared = await Promise.all(
      files.map(async (x) => ({
        ...x,
        content: await prepareImage(x.file as File),
      })),
    );
    const latest = captureFor(token);
    if (!latest || latest.used) return error("이미 제출된 링크입니다.", 409);
    const c = getClaim(latest.claim_id)!;
    if (c.status === "resolved") return error("완료된 접수입니다.", 409);
    const now = new Date().toISOString();
    db.exec("BEGIN IMMEDIATE");
    try {
      for (const x of prepared) {
        const id = randomUUID();
        db.prepare("INSERT INTO assets VALUES (?,?,?,?)").run(
          id,
          c.id,
          x.content,
          "image/jpeg",
        );
        c.assets.push({
          id,
          side: "incoming",
          label: x.label,
          url: "/api/assets/" + id,
          createdAt: now,
        });
      }
      c.status = "in_review";
      c.version++;
      c.events.push({ text: "고객이 사진 3장을 제출했습니다.", at: now });
      saveClaim(c);
      db.prepare("UPDATE captures SET used=1 WHERE token=?").run(hash(token));
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return error((e as Error).message);
  }
}
