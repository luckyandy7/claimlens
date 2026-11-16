import { NextRequest, NextResponse } from "next/server";
import { createSession, orgFor } from "@/lib/store";
import { localGuard, error } from "@/lib/http";
export async function POST(req: NextRequest) {
  try {
    localGuard(req);
    const existing = req.cookies.get("cl_session")?.value;
    const token = orgFor(existing) ? existing! : createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set("cl_session", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 604800,
    });
    return res;
  } catch (e) {
    return error((e as Error).message, 403);
  }
}
