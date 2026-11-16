"use client";

import { MotionNumber } from "./motion-system";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const sources = {
  mrc: "https://info.merchantriskcouncil.org/hubfs/Documents/Report%20PDFs/Global%20Fraud%20and%20Payments%20%28Reports%29/2026-global-ecommerce-payments-fraud-report.pdf#page=49",
  truepic:
    "https://www.globenewswire.com/news-release/2026/08/27/3352242/0/en/truepic-and-otterbox-partner-to-accelerate-warranty-claims-with-authentication-in-under-a-minute.html",
  paper: "https://doi.org/10.1093/qje/qjae044",
  pricing: "https://www.realpacking.com/ko/pricing",
};
const money = (n: number) => Math.round(n).toLocaleString("ko-KR");

export function EvidenceSection() {
  return (
    <section
      id="evidence"
      className="cl-evidence"
      aria-labelledby="evidence-title"
    >
      <div className="cl-evidence-heading">
        <h2 id="evidence-title">
          왜 이 문제에서
          <br />
          시작했을까요.
        </h2>
        <p>
          문제의 크기는 조사에서,
          <br />
          우리의 효과는 실제 사용에서 확인합니다.
        </p>
      </div>
      <div className="cl-evidence-main">
        <div className="cl-evidence-number">
          <span className="cl-proof-label">외부 조사 · MRC 2026</span>
          <strong>
            <MotionNumber value={61} />
            <span>%</span>
          </strong>
          <div className="cl-evidence-bar" aria-hidden="true">
            <span />
          </div>
          <div className="vienna-waffle" aria-hidden="true">
            {Array.from({ length: 100 }, (_, i) => (
              <i key={i} data-filled={i < 61} />
            ))}
          </div>
          <p>
            환불·정책 악용이 늘었다고
            <br />
            답한 응답자 비중
          </p>
        </div>
        <div className="cl-evidence-explanation">
          <h3>확인할 자료가 중요한 이유.</h3>
          <p>
            MRC의 국제 조사에서는 관련 응답자의 61%가 지난 1년 동안 환불·정책
            악용이 증가했다고 답했습니다. 우리는 이 문제에서 출발해, 담당자가
            자료를 모으고 비교하는 업무를 돕고자 합니다.
          </p>
          <p className="cl-evidence-limit">
            61%는 반품의 사기 비율이 아닙니다. 한국만의 조사나 AI 사진 사기
            통계도 아닙니다.
          </p>
          <a
            className="cl-source-link"
            href={sources.mrc}
            target="_blank"
            rel="noreferrer"
          >
            조사 원문 · 49쪽, Figure 39 <ArrowUpRight size={15} />
          </a>
          <small>
            조사: 2025.11–12 · 전체 37개국 1,278명
            <br />
            관련 사기 관리 실무자 표본 n=634 · 보고서 2026
          </small>
        </div>
      </div>
      <div className="cl-evidence-secondary">
        <div>
          <span className="cl-proof-label">해외 활용 사례 · 기업 발표</span>
          <h3>
            10만 건 이상의 보증 청구에
            <br />
            사진 인증이 쓰였습니다.
          </h3>
        </div>
        <div>
          <p>
            Truepic은 OtterBox 도입 후 4개월 미만 동안 10만 건 이상의 보증 청구
            이미지를 인증했다고 발표했습니다. 관련 업무의 실제 활용 사례이며,
            클레임렌즈의 실적이나 사기 적발 건수가 아닙니다.
          </p>
          <a
            className="cl-source-link"
            href={sources.truepic}
            target="_blank"
            rel="noreferrer"
          >
            Truepic 발표 · 2026.08.27 <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <details className="cl-research-detail">
        <summary>관련 논문은 무엇을 말하나요?</summary>
        <div>
          <h3>상담 업무에서의 AI 보조 효과 — 적용 범위는 다릅니다.</h3>
          <p>
            Brynjolfsson·Li·Raymond의 「Generative AI at Work」는 한 기업의
            상담원 5,172명을 분석해 AI 보조 도입 시 시간당 해결 건수가 평균 15%
            증가했다고 보고했습니다. 효과는 숙련도에 따라 달랐습니다.
          </p>
          <p>
            이 연구는 대화형 상담 보조에 관한 것으로, 사진 기반 반품 심사나
            클레임렌즈를 검증한 논문이 아닙니다. 현재 AI 사진 비교는 API 키 설정 후 실행할 수 있습니다. 따라서 이 15%를 우리 제품의 예상 절감률로
            사용하지 않습니다.
          </p>
          <a
            className="cl-source-link"
            href={sources.paper}
            target="_blank"
            rel="noreferrer"
          >
            QJE 140(2), 889–942 · 2025.02.04 온라인 게재{" "}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </details>
      <p className="cl-source-date">
        출처 확인: 2026.11.12 · 조사 보고서, 기업 발표, 학술 논문의 근거 수준을
        구분했습니다.
      </p>
    </section>
  );
}

export function ValueSection() {
  const [cases, setCases] = useState(300);
  const [minutes, setMinutes] = useState(2);
  const [hourly, setHourly] = useState(30000);
  const hours = (cases * minutes) / 60;
  const value = hours * hourly;
  const price = 299000;
  return (
    <>
      <section id="value" className="cl-value" aria-labelledby="value-title">
        <div className="cl-evidence-heading">
          <h2 id="value-title">
            우리 팀에 얼마나
            <br />
            도움이 될까요.
          </h2>
          <p>
            아직 절감 효과를 측정하지 않았습니다.
            <br />
            아래 가정을 바꾸어 도입 조건을 살펴보세요.
          </p>
        </div>
        <div className="cl-value-grid">
          <div className="cl-calculator-controls">
            <span className="cl-proof-label">
              가정 기반 계산 · 실제 성과 아님
            </span>
            <label htmlFor="value-cases">
              월 검토 건수 <output htmlFor="value-cases">{cases}건</output>
            </label>
            <input
              id="value-cases"
              type="range"
              min="0"
              max="300"
              step="10"
              value={cases}
              onChange={(e) => setCases(Number(e.target.value))}
            />
            <label htmlFor="value-minutes">
              건당 줄어드는 작업시간 가정{" "}
              <output htmlFor="value-minutes">{minutes}분</output>
            </label>
            <input
              id="value-minutes"
              type="range"
              min="0"
              max="10"
              step="1"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
            <label htmlFor="value-hourly">
              시간당 총 인건비 가정{" "}
              <output htmlFor="value-hourly">{money(hourly)}원</output>
            </label>
            <input
              id="value-hourly"
              type="range"
              min="10000"
              max="60000"
              step="5000"
              value={hourly}
              onChange={(e) => setHourly(Number(e.target.value))}
            />
            <p>
              기본값 300건·2분·3만 원은 계산 예시입니다. 외부 통계나 고객
              실측값이 아닙니다. 월 300건 포함 요금안 범위에서 계산합니다.
            </p>
          </div>
          <div
            className="cl-calculator-result"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>가정대로 줄어든다면, 월</span>
            <strong data-testid="value-hours">
              <MotionNumber value={hours} decimals={1} continuous />
              <small>시간</small>
            </strong>
            <p>다른 업무에 쓸 수 있는 시간</p>
            <dl>
              <div>
                <dt>업무 여력의 환산 가치</dt>
                <dd data-testid="value-money">
                  <MotionNumber value={value} continuous />원
                </dd>
              </div>
              <div>
                <dt>월 구독료 가안</dt>
                <dd>−{money(price)}원</dd>
              </div>
              <div>
                <dt>구독료 차감 후 환산 가치</dt>
                <dd data-testid="value-net">
                  <MotionNumber value={value - price} continuous />원
                </dd>
              </div>
            </dl>
            <p className="cl-calculator-caution">
              현금 인건비 절감이나 수익을 보장하지 않습니다. 초기 연동·교육
              비용, 고객의 촬영 부담은 별도입니다.
            </p>
          </div>
        </div>
        <details className="cl-research-detail">
          <summary>계산식과 실제 검증 방법</summary>
          <div>
            <p>
              월 확보 시간 = 월 검토 건수 × 건당 절감시간 ÷ 60.
              <br />
              환산 가치 = 월 확보 시간 × 시간당 총 인건비.
              <br />
              구독료 차감 후 환산 가치 = 환산 가치 − 299,000원. 모두 VAT 제외
              기준입니다.
            </p>
            <p>
              고객 실험에서는 자료 검색·재요청·비교·기록에 실제 사용한 시간을
              측정합니다. 제출 완료율과 고객 재요청률도 함께 확인해, 담당자의
              편의가 소비자의 부담으로 바뀌지 않는지 검증할 계획입니다.
            </p>
          </div>
        </details>
        <div className="cl-value-outcomes">
          <h3>
            줄이고 싶은 일과,
            <br />
            확인할 지표.
          </h3>
          <dl>
            <div>
              <dt>판매자의 반복 작업</dt>
              <dd>사건별 실제 작업시간으로 확인</dd>
            </div>
            <div>
              <dt>고객에게 다시 묻는 일</dt>
              <dd>사진 재요청률·제출 완료율로 확인</dd>
            </div>
            <div>
              <dt>처리 이유를 다시 찾는 일</dt>
              <dd>판단 기록 완결률로 확인</dd>
            </div>
          </dl>
        </div>
      </section>
      <section
        id="business"
        className="cl-business"
        aria-labelledby="business-title"
      >
        <div>
          <h2 id="business-title">
            판매자의 업무를 돕고,
            <br />월 이용료를 받습니다.
          </h2>
          <p>
            주문별 자료 수집·비교·처리 이력을 제공하는
            <br />
            기업용 구독 모델을 검증하고 있습니다.
          </p>
          <span className="cl-proof-label">
            가격 가설 · 판매 중인 확정 요금 아님
          </span>
        </div>
        <div className="cl-price-proposal">
          <span>초기 표준 요금안</span>
          <p className="cl-price">
            <strong>299,000</strong>원 <small>/ 월 · VAT 별도</small>
          </p>
          <ul>
            <li>자료 제출이 완료된 접수 월 300건 포함</li>
            <li>같은 접수의 재제출은 중복 과금하지 않는 안</li>
            <li>비교 화면·담당자 검토·처리 이력 제공</li>
          </ul>
          <p>
            30일·10만 원의 유료 실험을 제안하고, 실제 결제와 정가 전환·갱신으로
            가격을 검증할 계획입니다. 현재 유료 고객과 절감 실적은 확보되지
            않았습니다.
          </p>
          <details className="cl-research-detail">
            <summary>요금과 사업성의 근거는 무엇인가요?</summary>
            <div>
              <p>
                국내 리얼패킹은 월 결제 기준 라이선스당 베이직 5만 원·프로 9만
                원(VAT 별도)을 공개하고 있습니다. 관련 업무 도구의 유료 시장은
                확인되지만, 과금 단위와 기능 범위가 달라 우리 요금의 타당성을
                증명하지는 않습니다.
              </p>
              <a
                className="cl-source-link"
                href={sources.pricing}
                target="_blank"
                rel="noreferrer"
              >
                리얼패킹 공식 요금 · 2026.11.12 확인 <ArrowUpRight size={15} />
              </a>
              <p>
                29만 9천 원은 고객 가치와 운영 원가를 실험하기 위한 가설입니다.
                고객의 지불 의사, 건당 원가, 지원시간을 측정한 뒤 확정합니다.
                환불 거절액에 비례한 수수료나 소비자 자료 판매는 수익모델에
                포함하지 않습니다.
              </p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
