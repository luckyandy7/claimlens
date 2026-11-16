import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth, error } from "@/lib/http";
import { db, listClaims } from "@/lib/store";
import { validateClaim, type Claim } from "@/lib/domain";
export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(listClaims(auth(req)));
  } catch (e) {
    return error((e as Error).message, 401);
  }
}
export async function POST(req: NextRequest) {
  try {
    const org = auth(req);
    const input = validateClaim(await req.json());
    const now = new Date().toISOString();
    const c: Claim = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      version: 1,
      status: "awaiting_evidence",
      assets: [],
      events: [{ at: now, text: "새 접수가 등록되었습니다." }],
      note: "",
    };
    db.prepare("INSERT INTO claims VALUES (?,?,?)").run(
      c.id,
      org,
      JSON.stringify(c),
    );
    return NextResponse.json(c, { status: 201 });
  } catch (e) {
    return error((e as Error).message);
  }
}
