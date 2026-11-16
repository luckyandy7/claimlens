import test from "node:test";
import assert from "node:assert/strict";
import { validateClaim, canReview } from "../src/lib/domain";
test("빈 접수와 과도한 입력을 거절한다", () => {
  assert.throws(() => validateClaim({}));
  assert.throws(() =>
    validateClaim({
      order: "x".repeat(501),
      customer: "a",
      product: "b",
      reason: "c",
    }),
  );
});
test("접수 필드를 정규화한다", () => {
  assert.equal(
    validateClaim({ order: "  A1 ", customer: "a", product: "b", reason: "c" })
      .order,
    "A1",
  );
});
test("검토 상태에서만 처리한다", () => {
  assert.equal(canReview("in_review"), true);
  for (const status of [
    "awaiting_evidence",
    "needs_more_evidence",
    "resolved",
  ] as const)
    assert.equal(canReview(status), false);
});
