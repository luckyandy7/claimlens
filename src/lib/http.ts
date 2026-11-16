import { NextRequest, NextResponse } from "next/server";
import { orgFor } from "./store";
export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
export function localGuard(req: NextRequest) {
  if (!["localhost", "127.0.0.1", "[::1]"].includes(req.nextUrl.hostname))
    throw new Error("이 버전은 로컬 데모 전용입니다.");
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host"))
    throw new Error("허용되지 않은 요청입니다.");
}
export function auth(req: NextRequest) {
  localGuard(req);
  const org = orgFor(req.cookies.get("cl_session")?.value);
  if (!org) throw new Error("작업공간을 먼저 열어 주세요.");
  return org;
}
