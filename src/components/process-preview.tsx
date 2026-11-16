import { Camera, Check, Link2, ScanLine } from "lucide-react";

export function ProcessPreview({ stage }: { stage: number }) {
  return (
    <div className="cl-workflow-preview" key={stage}>
      <div className="cl-preview-order">
        <span>예시 주문 CL–1024</span>
        <span>에센셜 헤드폰</span>
      </div>
      {stage === 0 ? (
        <>
          <div className="cl-preview-photo">
            <img
              src="/images/editorial-headphones-small.webp"
              alt="출고 기록에 첨부하는 제품 사진 예시"
              width={768}
              height={512}
              loading="lazy"
              decoding="async"
            />
            <span>AI 연출 이미지</span>
          </div>
          <div className="cl-preview-record">
            <Camera size={18} />
            <div>
              <strong>주문과 출고 사진을 연결</strong>
              <p>출고 시 남긴 사진을 같은 접수에서 찾습니다.</p>
            </div>
            <Check size={18} />
          </div>
        </>
      ) : stage === 1 ? (
        <>
          <div className="cl-preview-request">
            <Link2 size={22} />
            <h3>고객은 링크 하나로.</h3>
            <p>앱 설치 없이 안내에 맞춰 사진 3장을 제출합니다.</p>
          </div>
          <ol className="cl-preview-shots">
            {["제품 전체", "확인할 부분", "포장과 구성품"].map((label, i) => (
              <li key={label}>
                <Camera size={23} />
                <span>0{i + 1}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <div className="cl-preview-footnote">
            제출 화면 예시 · 실제 요청 링크는 작업공간에서 발급
          </div>
        </>
      ) : (
        <>
          <div className="cl-preview-compare">
            {["출고 기록", "고객 제출"].map((label) => (
              <div key={label}>
                <span>{label}</span>
                <div>
                  <ScanLine size={30} />
                  <p>
                    {label === "출고 기록" ? "발송 전 상태" : "도착 후 상태"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="cl-preview-review">
            <span>담당자 검토</span>
            <strong>
              두 기록을 나란히 확인하고,
              <br />
              처리 사유를 남깁니다.
            </strong>
            <p>
              API 키 설정 후 AI 사진 비교를 실행할 수 있습니다. 최종 판단은 담당자가 내립니다.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
