"use client";
import { LoadingRecords } from "./loading-records";
import { MotionNumber } from "./motion-system";
import { EvidenceGallery, ImageDialog } from "./evidence-gallery";
import Link, { navigateWithTransition } from "./route-transition";
import { ActionButton, SelectionTrack } from "./interaction-primitives";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  ArrowUpRight,
  Inbox,
  ShieldCheck,
  ChevronRight,
  Upload,
  Link2,
  Check,
  ScanLine,
  Clock,
  ArrowLeft,
  ExternalLink,
  X,
} from "lucide-react";
import { Brand, DemoButton, Empty, Back, api, json } from "./shared";
import { statusLabel, type Claim, type Status } from "@/lib/domain";
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="org-label">
          <span className="org-avatar">C</span>
          <div>
            체험 작업공간<small>LOCAL WORKSPACE</small>
          </div>
        </div>
        <span className="nav-section">WORKSPACE</span>
        <Link
          className={
            "side-link " + (pathname === "/app/claims" ? "active" : "")
          }
          aria-current={pathname === "/app/claims" ? "page" : undefined}
          href="/app/claims"
        >
          <Inbox size={18} />
          접수함
          <ChevronRight size={14} />
        </Link>
        <Link
          className={
            "side-link " + (pathname === "/app/claims/new" ? "active" : "")
          }
          aria-current={pathname === "/app/claims/new" ? "page" : undefined}
          href="/app/claims/new"
        >
          <Plus size={18} />새 접수
        </Link>
        <div className="sidebar-bottom">
          <ShieldCheck size={20} />
          <p>
            기록은 명확하게.
            <br />
            판단은 신중하게.
          </p>
          <small>
            가상 자료로 경험하는 데모입니다.
            <br />
            실제 고객 개인정보는 넣지 마세요.
          </small>
          <Link href="/">
            서비스 소개 <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="app-body">
        <header className="app-topbar">
          <span>
            작업공간 <ChevronRight size={14} /> 접수 관리
          </span>
          <span className="demo-pill">
            <i /> 로컬 데모
          </span>
        </header>
        <main id="main" className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
export function Claims() {
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    api("/api/claims")
      .then(setClaims)
      .catch((e) => setErr(e.message));
  }, []);
  const filtered = claims?.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      `${c.order} ${c.product} ${c.customer}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <Shell>
      <div className="page-title">
        <div>
          <h1>
            접수함<span className="muted-number">{claims?.length ?? "—"}</span>
          </h1>
          <p>출고부터 고객 제출까지, 확인할 기록을 한곳에서.</p>
        </div>
        <Link href="/app/claims/new" className="button dark">
          <Plus size={17} />새 접수
        </Link>
      </div>
      {err ? (
        <Empty text={err}>
          <DemoButton />
        </Empty>
      ) : (
        <>
          <div className="stat-row">
            {(["in_review", "awaiting_evidence", "resolved"] as Status[]).map(
              (s, i) => (
                <div key={s}>
                  <span>{statusLabel[s]}</span>
                  <strong>
                    {claims ? (
                      <MotionNumber
                        value={claims.filter((c) => c.status === s).length}
                      />
                    ) : (
                      "—"
                    )}
                    <small>건</small>
                  </strong>
                  <span className={"stat-caption line-" + i}>
                    {
                      [
                        "자료를 비교하고 판단할 접수",
                        "고객 사진을 기다리는 접수",
                        "처리 기록이 남은 접수",
                      ][i]
                    }
                  </span>
                </div>
              ),
            )}
          </div>
          {claims && (
            <div className="workspace-summary">
              <div>
                <span>현재 접수의 처리 현황</span>
                <strong>
                  <MotionNumber
                    value={
                      claims.length
                        ? Math.round(
                            (claims.filter((c) => c.status === "resolved")
                              .length /
                              claims.length) *
                              100,
                          )
                        : 0
                    }
                  />
                  % <small>검토 완료</small>
                </strong>
              </div>
              <div className="workspace-progress">
                <div className="workspace-progress-track">
                  <div
                    className="workspace-progress-fill"
                    style={{
                      width: `${claims.length ? (claims.filter((c) => c.status === "resolved").length / claims.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p>
                  완료 {claims.filter((c) => c.status === "resolved").length}건
                  / 전체 {claims.length}건 · 현재 작업공간 데이터
                </p>
              </div>
            </div>
          )}
          <div className="list-panel" data-route-ready={!!claims}>
            <div className="list-tools">
              <SelectionTrack
                className="tabs"
                selected={filter}
                label="접수 상태 필터"
              >
                {[
                  ["all", "전체"],
                  ["in_review", "검토 중"],
                  ["awaiting_evidence", "자료 대기"],
                  ["needs_more_evidence", "추가 요청"],
                  ["resolved", "완료"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={filter === value ? "selected" : ""}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </SelectionTrack>
              <label className="search">
                <Search size={16} />
                <input
                  aria-label="접수 검색"
                  placeholder="주문번호, 상품, 고객 검색"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            {!claims ? (
              <LoadingRecords />
            ) : !filtered?.length ? (
              <Empty text="조건에 맞는 접수가 없습니다.">
                <button
                  className="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  필터 초기화
                </button>
              </Empty>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>상품 / 주문번호</th>
                      <th>고객</th>
                      <th>접수 상태</th>
                      <th>등록일</th>
                      <th>
                        <span className="sr-only">열기</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody key={filter} className="filter-results">
                    {filtered.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link
                            className="product-link"
                            href={"/app/claims/" + c.id}
                          >
                            <span
                              className="product-thumb"
                              style={{
                                viewTransitionName: `claim-photo-${c.id}`,
                              }}
                            >
                              {c.assets[0] ? (
                                <img src={c.assets[0].url} alt="" />
                              ) : (
                                <Inbox size={22} />
                              )}
                            </span>
                            <span>
                              <strong
                                style={{
                                  viewTransitionName: `claim-title-${c.id}`,
                                }}
                              >
                                {c.product}
                              </strong>
                              <small>{c.order}</small>
                            </span>
                          </Link>
                        </td>
                        <td>{c.customer}</td>
                        <td>
                          <span className={"badge " + c.status}>
                            {statusLabel[c.status]}
                          </span>
                        </td>
                        <td className="date">
                          {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td>
                          <Link
                            className="icon-button"
                            aria-label={c.product + " 접수 열기"}
                            href={"/app/claims/" + c.id}
                          >
                            <ArrowUpRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="list-footer">
              <span>총 {filtered?.length ?? 0}개의 접수</span>
              <span>기록을 바탕으로, 사람이 검토합니다.</span>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
}
export function NewClaim() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const c = await api("/api/claims", json(data));
      navigateWithTransition("/app/claims/" + c.id, () =>
        router.push("/app/claims/" + c.id),
      );
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <Shell>
      <Back href="/app/claims">접수함으로</Back>
      <div className="page-title">
        <div>
          <h1>새 접수 만들기</h1>
          <p>주문 정보를 연결하고, 필요한 자료를 요청하세요.</p>
        </div>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-section-title">
          <span>01</span>
          <h2>기본 정보</h2>
        </div>
        <div className="form-grid">
          {[
            ["order", "주문번호", "예: ORD-2026-001"],
            ["customer", "고객명", "데모용 이름"],
            ["product", "상품명", "예: 에센셜 헤드폰 · 스톤"],
          ].map(([key, label, placeholder]) => (
            <label key={key}>
              {label}
              <input
                name={key}
                required
                maxLength={150}
                placeholder={placeholder}
              />
            </label>
          ))}
        </div>
        <label>
          접수 사유
          <textarea
            name="reason"
            required
            maxLength={500}
            rows={4}
            placeholder="확인이 필요한 내용을 적어 주세요."
          />
        </label>
        <p className="form-hint">
          접수를 만든 다음 출고 사진을 등록하고 고객 제출 링크를 발급할 수
          있습니다.
        </p>
        {err && (
          <p className="error" role="alert">
            {err}
          </p>
        )}
        <div className="form-actions">
          <Link className="button" href="/app/claims">
            취소
          </Link>
          <ActionButton
            className="button dark"
            busy={busy}
            busyLabel="접수 등록 중…"
          >
            접수 만들기
            <ArrowUpRight size={16} />
          </ActionButton>
        </div>
      </form>
    </Shell>
  );
}
export function Detail({ id }: { id: string }) {
  const [c, setC] = useState<Claim | null>(null);
  const [err, setErr] = useState("");
  const [pending, setPending] = useState("");
  const busy = !!pending;
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const [zoom, setZoom] = useState<string | null>(null);
  useEffect(() => {
    api("/api/claims/" + id)
      .then(setC)
      .catch((e) => setErr(e.message));
  }, [id]);
  async function run(action: string, fn: () => Promise<void>) {
    setPending(action);
    setErr("");
    try {
      await fn();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setPending("");
    }
  }
  async function review(status: string) {
    await run(status, async () => {
      setC(
        await api(
          "/api/claims/" + id,
          json({ action: "review", status, note, version: c?.version }),
        ),
      );
      setNote("");
    });
  }
  return (
    <Shell>
      <Back href="/app/claims">접수함으로</Back>
      {!c ? (
        err ? (
          <Empty text={err} />
        ) : (
          <LoadingRecords detail />
        )
      ) : (
        <>
          <div className="page-title detail-title" data-route-ready="true">
            <div>
              <span className="eyebrow">{c.order}</span>
              <div className="detail-identity">
                {c.assets[0] && (
                  <img
                    className="detail-identity-photo"
                    src={c.assets[0].url}
                    alt=""
                    style={{ viewTransitionName: `claim-photo-${c.id}` }}
                  />
                )}
                <h1 style={{ viewTransitionName: `claim-title-${c.id}` }}>
                  {c.product}
                </h1>
              </div>
              <p>
                {c.customer} <span className="divider">/</span>{" "}
                {new Date(c.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
            <span className={"badge " + c.status}>{statusLabel[c.status]}</span>
          </div>
          {err && (
            <p className="error" role="alert">
              {err}
            </p>
          )}
          <div className="detail-grid">
            <div className="evidence-area">
              <div className="panel">
                <div className="panel-heading">
                  <h2>
                    <ScanLine size={18} />
                    증거 비교
                  </h2>
                  <span>사진을 눌러 크게 보기</span>
                </div>
                <div className="compare-grid">
                  {(["outgoing", "incoming"] as const).map((side) => (
                    <div className="evidence-side" key={side}>
                      <div className="evidence-heading">
                        <span>
                          {side === "outgoing"
                            ? "01 / 출고 기록"
                            : "02 / 고객 제출"}
                        </span>
                        <small>
                          {c.assets.filter((a) => a.side === side).length}장
                        </small>
                      </div>
                      {c.assets.filter((a) => a.side === side).length ? (
                        <EvidenceGallery
                          assets={c.assets.filter((a) => a.side === side)}
                          onZoom={setZoom}
                        />
                      ) : (
                        <div className="photo-empty">
                          <Upload size={28} />
                          <p>
                            {side === "outgoing"
                              ? "출고 사진을 등록해 주세요."
                              : "고객이 사진을 제출하면\n이곳에 표시됩니다."}
                          </p>
                        </div>
                      )}
                      {side === "outgoing" && c.status !== "resolved" && (
                        <label className="upload-button">
                          <Upload size={15} />
                          {pending === "upload" ? "등록 중…" : "출고 사진 추가"}
                          <input
                            disabled={busy}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                run("upload", async () => {
                                  const form = new FormData();
                                  form.set("file", file);
                                  setC(
                                    await api("/api/claims/" + id, {
                                      method: "POST",
                                      body: form,
                                    }),
                                  );
                                });
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel timeline">
                <div className="panel-heading">
                  <h2>
                    <Clock size={17} />
                    처리 이력
                  </h2>
                </div>
                {c.events
                  .slice()
                  .reverse()
                  .map((event, i) => (
                    <div className="timeline-item" key={i}>
                      <i />
                      <div>
                        <p>{event.text}</p>
                        <small>
                          {new Date(event.at).toLocaleString("ko-KR")}
                        </small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <aside className="review-column">
              <div className="panel ai-analysis">
                <h2>AI 사진 비교</h2>
                <p>
                  사진에서 보이는 차이와 불확실성을 정리합니다. 최종 결정은
                  담당자가 내립니다.
                </p>
                <p className="form-hint">
                  실행 시 사진이 OpenAI API로 전송되며 사용료가 발생합니다.
                </p>
                <ActionButton
                  className="button dark"
                  busy={pending === "analysis"}
                  busyLabel="사진 분석 중…"
                  disabled={busy || c.status === "resolved"}
                  onClick={() =>
                    run("analysis", async () => {
                      setC(
                        await api("/api/claims/" + id + "/analyze", {
                          method: "POST",
                        }),
                      );
                    })
                  }
                >
                  AI 분석 실행
                </ActionButton>
                {c.analysis && (
                  <div className="ai-result">
                    <p>{c.analysis.summary}</p>
                    {(
                      [
                        ["관찰한 내용", c.analysis.observations],
                        ["불확실한 내용", c.analysis.uncertainties],
                        ["추가 사진 제안", c.analysis.additionalPhotos],
                      ] as [string, string[]][]
                    ).map(([label, items]) => (
                      <section key={label}>
                        <h3>{label}</h3>
                        <ul>
                          {items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                    <small>
                      {c.analysis.model} ·{" "}
                      {new Date(c.analysis.createdAt).toLocaleString("ko-KR")}
                      {c.assets.map((a) => a.id).join() !==
                      c.analysis.assetIds.join()
                        ? " · 사진이 변경되어 재분석이 필요합니다."
                        : ""}
                    </small>
                  </div>
                )}
              </div>
              <div className="panel context-panel">
                <span className="eyebrow">CLAIM CONTEXT</span>
                <h2>고객의 접수 내용</h2>
                <p>{c.reason}</p>
              </div>
              <div className="panel readiness">
                <h2>
                  <LayersIcon />
                  자료 확인
                </h2>
                <p>
                  <Check size={16} /> 출고 자료{" "}
                  {c.assets.filter((a) => a.side === "outgoing").length}장
                </p>
                <p>
                  <Check size={16} /> 고객 자료{" "}
                  {c.assets.filter((a) => a.side === "incoming").length}장
                </p>
                <div className="notice">
                  현재는 자료 수집·수동 검토 버전입니다. AI 이미지 분석은
                  연결되지 않았습니다.
                </div>
              </div>
              {c.status !== "resolved" && (
                <div className="panel link-panel">
                  <h2>고객에게 자료 요청</h2>
                  <p>안내에 따라 사진을 제출할 수 있는 링크입니다.</p>
                  <ActionButton
                    className="button full"
                    disabled={busy}
                    busy={pending === "link"}
                    busyLabel="자료 요청 준비 중…"
                    onClick={() =>
                      run("link", async () => {
                        const data = await api(
                          "/api/claims/" + id,
                          json({ action: "link" }),
                        );
                        setLink(location.origin + "/capture/" + data.token);
                        setCopied(false);
                      })
                    }
                  >
                    <Link2 size={16} />
                    {link ? "새 링크 발급" : "제출 링크 발급"}
                  </ActionButton>
                  {link && (
                    <div className="generated-link">
                      <input
                        aria-label="고객 제출 링크"
                        value={link}
                        readOnly
                        onFocus={(e) => e.target.select()}
                      />
                      <ActionButton
                        className="text-link"
                        success={copied}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(link);
                            setCopied(true);
                          } catch {
                            setErr("링크를 선택해 직접 복사해 주세요.");
                          }
                        }}
                      >
                        {copied ? "복사 완료" : "링크 복사"}
                      </ActionButton>
                      <a
                        className="text-link"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        제출 화면 열기 <ExternalLink size={14} />
                      </a>
                      <small>
                        72시간 유효 · 재발급하면 기존 링크는 사용 불가
                      </small>
                    </div>
                  )}
                </div>
              )}
              <div className="panel decision-panel">
                <h2>담당자 검토</h2>
                {c.status === "resolved" ? (
                  <div className="resolved">
                    <Check size={24} />
                    <strong>검토를 완료했습니다.</strong>
                    <p>{c.note}</p>
                  </div>
                ) : (
                  <>
                    <label>
                      처리 사유
                      <textarea
                        rows={4}
                        maxLength={2000}
                        placeholder="확인한 내용과 다음 조치를 기록해 주세요."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </label>
                    <ActionButton
                      className="button dark full"
                      busy={pending === "resolved"}
                      busyLabel="검토 결과 저장 중…"
                      disabled={
                        busy || !note.trim() || c.status !== "in_review"
                      }
                      onClick={() => review("resolved")}
                    >
                      <Check size={16} />
                      검토 완료
                    </ActionButton>
                    <ActionButton
                      className="button full"
                      busy={pending === "needs_more_evidence"}
                      busyLabel="요청 기록 중…"
                      disabled={
                        busy || !note.trim() || c.status !== "in_review"
                      }
                      onClick={() => review("needs_more_evidence")}
                    >
                      추가 자료 요청
                    </ActionButton>
                    {c.status !== "in_review" && (
                      <small>고객 자료 접수 후 처리할 수 있습니다.</small>
                    )}
                  </>
                )}
              </div>
            </aside>
          </div>
          {zoom && <ImageDialog url={zoom} onClose={() => setZoom(null)} />}
        </>
      )}
    </Shell>
  );
}
function LayersIcon() {
  return <ScanLine size={17} />;
}
