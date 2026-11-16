export type Status =
  "awaiting_evidence" | "in_review" | "needs_more_evidence" | "resolved";
export const statusLabel: Record<Status, string> = {
  awaiting_evidence: "자료 대기",
  in_review: "검토 중",
  needs_more_evidence: "추가 자료 요청",
  resolved: "검토 완료",
};
export interface Asset {
  id: string;
  side: "outgoing" | "incoming";
  label: string;
  url: string;
  createdAt: string;
}
export interface Event {
  text: string;
  at: string;
}
export interface Claim {
  id: string;
  order: string;
  product: string;
  customer: string;
  reason: string;
  status: Status;
  createdAt: string;
  version: number;
  assets: Asset[];
  events: Event[];
  note: string;
  analysis?: import("./analysis").Analysis;
}
export function canReview(status: Status) {
  return status === "in_review";
}
export function validateClaim(input: Record<string, unknown>) {
  const fields = ["order", "product", "customer", "reason"] as const;
  const result = {} as Record<(typeof fields)[number], string>;
  for (const key of fields) {
    if (
      typeof input[key] !== "string" ||
      !input[key].trim() ||
      input[key].length > 500
    )
      throw new Error("주문번호, 상품명, 고객명, 접수 사유를 확인해 주세요.");
    result[key] = input[key].trim();
  }
  return result;
}
