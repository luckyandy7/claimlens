"use client";

import { ProcessPreview } from "./process-preview";
import { LandingScroll } from "./landing-scroll";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { Brand, DemoButton } from "./shared";
import "./landing.css";
import { EvidenceSection, ValueSection } from "./landing-evidence";

const stages = [
  {
    title: "출고 기록",
    caption: "보내기 전의 모습을 먼저.",
    body: "주문에 출고 사진을 연결하세요. 흩어진 폴더를 다시 찾지 않아도, 검토할 때 바로 꺼내볼 수 있습니다.",
    label: "판매자 자료",
    detail: "주문 CL–1024 · 출고 사진 1장",
    note: "출고 사진을 등록했습니다.",
  },
  {
    title: "고객의 사진",
    caption: "다시 묻는 일을 줄이도록.",
    body: "전체 모습, 확인할 부분, 구성품. 고객에게 제출 링크를 보내고 필요한 사진을 한 번에 안내하세요.",
    label: "고객 자료",
    detail: "주문 CL–1024 · 사진 제출 안내",
    note: "전체 모습과 구성품을 요청했습니다.",
  },
  {
    title: "담당자의 검토",
    caption: "판단 옆에, 판단한 이유까지.",
    body: "출고 자료와 고객 사진을 함께 보고 처리 사유를 남기세요. 다음 담당자도 처음부터 묻지 않도록.",
    label: "검토 기록",
    detail: "주문 CL–1024 · 담당자 확인",
    note: "자료를 확인한 뒤 처리 사유를 남깁니다.",
  },
];
const faqs = [
  [
    "고객도 앱을 설치해야 하나요?",
    "아니요. 담당자가 발급한 제출 링크를 브라우저에서 열어 사진을 보낼 수 있습니다. 촬영이 어려운 경우에는 기존 상담 경로를 이용할 수 있습니다.",
  ],
  [
    "AI가 반품 승인 여부를 결정하나요?",
    "아니요. 현재 데모는 사진 수집·비교와 검토 기록을 지원합니다. API 키를 설정하면 AI 사진 비교를 실행할 수 있으며, 최종 판단은 담당자가 내립니다.",
  ],
  [
    "지금 실제 업무에 사용할 수 있나요?",
    "현재는 기능을 체험하는 로컬 데모입니다. 운영용 로그인, 원본 보관 및 삭제 정책은 개발 중이므로 실제 고객의 개인정보나 민감한 사진을 넣지 마세요.",
  ],
];

export default function Landing() {
  const [stage, setStage] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="cl-page">
      <LandingScroll />
      <header className="cl-nav">
        <Brand />
        <nav aria-label="소개 페이지">
          <a href="#evidence">시작한 이유</a>
          <a href="#process">사용 방식</a>
          <a href="#value">기대효과·요금</a>
          <a href="#questions">궁금한 점</a>
        </nav>
        <DemoButton className="cl-nav-action">데모 열기</DemoButton>
      </header>
      <main id="main">
        <section className="cl-intro">
          <div className="cl-intro-heading">
            <div className="vienna-kicker"><span className="vienna-mark" aria-hidden="true" />CLAIMLENS / 기록에서 판단까지</div>
            <h1>
              사진은 모으고.
              <br />
              판단은 <span>선명하게.</span>
            </h1>
          </div>
          <div className="cl-intro-aside">
            <p>
              출고할 때와 고객이 받은 순간.
              <br />
              반품 검토에 필요한 두 기록을
              <br />
              한곳에서 확인하세요.
            </p>
            <DemoButton className="cl-primary">직접 경험하기</DemoButton>
            <span className="cl-demo-note">가입 없이 둘러보는 제품 데모</span>
          </div>
        </section>
        <section className="cl-scene" aria-label="제품 기록 예시">
          <img
            className="cl-scene-photo"
            srcSet="/images/editorial-headphones-small.webp 768w, /images/editorial-headphones.webp 1536w"
            sizes="(max-width: 760px) 100vw, 96vw"
            src="/images/editorial-headphones.webp"
            alt="열린 배송 상자와 주황색 헤드폰을 담은 제품 연출 사진"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <div className="cl-scene-title" aria-hidden="true">
            Every detail
            <br />
            <em>has a story.</em>
          </div>
          <div className="cl-photo-label">제품 연출 이미지 · AI 생성</div>
          <a
            href="#process"
            className="cl-scene-link"
            aria-label="사진이 기록이 되는 과정 보기"
          >
            <ArrowDown size={23} />
          </a>
          <div className="cl-case-strip">
            <span className="cl-case-id">
              CL–1024 <small>예시 접수</small>
            </span>
            <span>
              에센셜 헤드폰 <small>구성품 확인 요청</small>
            </span>
            <span className="cl-case-state">
              <span />
              담당자 검토 대기
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
        </section>
        <section className="cl-context">
          <p>
            사진은 대화방에.
            <br />
            출고 기록은 다른 폴더에.
          </p>
          <div>
            <h2>
              확인하는 일까지
              <br />
              복잡할 필요는 없으니까.
            </h2>
            <p>
              주문을 찾고, 사진을 요청하고, 기록을 남기는 일.
              <br />
              클레임렌즈는 그 사이를 연결합니다.
            </p>
            <a href="#process">
              한 건의 접수가 처리되는 과정 <ArrowRight size={17} />
            </a>
          </div>
        </section>
        <EvidenceSection />
        <section id="process" className="cl-process">
          <div className="cl-process-top">
            <h2>
              한 주문의
              <br />
              앞뒤를 함께.
            </h2>
            <p>
              기록을 따라가 보세요.
              <br />
              확인해야 할 순간만 남았습니다.
            </p>
          </div>
          <div className="cl-process-grid">
            <div className="cl-process-menu">
              <div
                className="cl-tabs"
                role="tablist"
                aria-label="접수 처리 단계"
                aria-orientation="vertical"
              >
                {stages.map((s, i) => (
                  <button
                    key={s.title}
                    id={`stage-tab-${i}`}
                    role="tab"
                    aria-selected={stage === i}
                    aria-controls="stage-panel"
                    tabIndex={stage === i ? 0 : -1}
                    onClick={() => setStage(i)}
                    onKeyDown={(e) => {
                      if (
                        ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)
                      ) {
                        e.preventDefault();
                        const n =
                          e.key === "Home"
                            ? 0
                            : e.key === "End"
                              ? 2
                              : (i + (e.key === "ArrowDown" ? 1 : 2)) % 3;
                        setStage(n);
                        document.getElementById(`stage-tab-${n}`)?.focus();
                      }
                    }}
                  >
                    <span className="cl-step-index">0{i + 1}</span>
                    <span>{s.title}</span>
                    <ArrowUpRight size={20} />
                  </button>
                ))}
              </div>
              <div
                id="stage-panel"
                role="tabpanel"
                aria-labelledby={`stage-tab-${stage}`}
                className="cl-stage-copy"
              >
                <h3>{stages[stage].caption}</h3>
                <p>{stages[stage].body}</p>
              </div>
              <DemoButton className="cl-text-action">
                내 접수 만들어보기
              </DemoButton>
            </div>
            <div className="cl-specimen">
              <div className="cl-specimen-head">
                <span>{stages[stage].label}</span>
                <span>작동 방식 예시</span>
              </div>
              <ProcessPreview stage={stage} />
              <div className="cl-specimen-footer">
                <span>{stages[stage].detail}</span>
                <p>
                  <Check size={16} />
                  {stages[stage].note}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="cl-principle">
          <span className="cl-large-amp" aria-hidden="true">
            &
          </span>
          <div>
            <h2>
              도구는 기록을 연결하고,
              <br />
              사람은 판단합니다.
            </h2>
            <p>
              사진 한 장만으로 모든 것을 알 수는 없습니다.
              <br />
              클레임렌즈는 근거를 함께 볼 수 있도록 돕습니다.
              <br />
              최종 결정과 그 이유는 담당자의 몫으로 남겨둡니다.
            </p>
          </div>
        </section>
        <ValueSection />
        <section id="questions" className="cl-faq">
          <h2>시작하기 전에.</h2>
          <div>
            {faqs.map(([q, a], i) => (
              <div className="cl-faq-item" key={q}>
                <h3>
                  <button
                    aria-expanded={open === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    {q}
                    {open === i ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={open !== i}>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="cl-end">
          <h2>
            다음 접수는,
            <br />
            조금 더 명확하게.
          </h2>
          <div>
            <DemoButton className="cl-primary">첫 접수 만들어보기</DemoButton>
            <p>예시 자료로 먼저 경험해 보세요.</p>
          </div>
        </section>
      </main>
      <footer className="cl-footer">
        <Brand />
        <p>반품 검토를 위한 기록의 연결.</p>
        <span>© 2026 ClaimLens · 제품 데모</span>
        <a href="#main">
          위로 <ArrowUpRight size={15} />
        </a>
      </footer>
    </div>
  );
}
