"use client";
import { ActionButton } from "./interaction-primitives";
import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Brand, api, Empty } from "./shared";
const steps = [
  {
    title: "제품 전체 모습",
    text: "제품이 프레임 안에 모두 들어오도록 촬영해 주세요.",
  },
  {
    title: "확인이 필요한 부분",
    text: "문제가 있는 부분이 선명하게 보이도록 가까이 촬영해 주세요.",
  },
  {
    title: "제품 식별정보",
    text: "모델명·라벨·시리얼 번호가 보이도록 촬영해 주세요. 없다면 다른 각도의 사진을 제출해 주세요.",
  },
];
export default function Capture({ token }: { token: string }) {
  const [data, setData] = useState<{
    product: string;
    order: string;
    submitted: boolean;
  } | null>(null);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/api/capture/" + token)
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [token]);
  useEffect(() => {
    const file = photos[step];
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photos, step]);
  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const form = new FormData();
      photos.forEach((p, i) => {
        if (p) form.set("photo" + i, p);
      });
      await api("/api/capture/" + token, { method: "POST", body: form });
      setData((d) => (d ? { ...d, submitted: true } : d));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="capture-page">
      <header>
        <Brand />
        <span>상품 상태 확인</span>
      </header>
      <main id="main" className="capture-main">
        {!data ? (
          <Empty text={err || "요청을 확인하는 중…"} />
        ) : data.submitted ? (
          <div className="capture-success">
            <span>
              <Check size={38} />
            </span>
            <div className="eyebrow">ALL SET</div>
            <h1>자료가 전달되었습니다.</h1>
            <p>
              담당자가 사진을 확인할 예정입니다.
              <br />
              추가 안내는 기존 상담 채널에서 확인해 주세요.
            </p>
            <div className="capture-order">
              {data.product}
              <small>{data.order}</small>
            </div>
          </div>
        ) : (
          <>
            <div className="eyebrow">A LITTLE CONTEXT GOES A LONG WAY</div>
            <h1>
              상품의 상태를
              <br />
              함께 확인해 볼까요?
            </h1>
            <p>
              안내된 사진 3장을 보내 주세요.
              <br />
              사진은 해당 접수의 검토를 위해 사용됩니다.
            </p>
            <div className="capture-order">
              {data.product}
              <small>{data.order}</small>
            </div>
            <div className="capture-progress">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setStep(i)}
                  className={i === step ? "current" : ""}
                  aria-label={s.title + " 단계"}
                  aria-current={i === step ? "step" : undefined}
                >
                  <span>
                    {photos[i] ? (
                      <Check size={16} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <i />
                </button>
              ))}
            </div>
            <div key={step} className="capture-step-title">
              <h2>{steps[step].title}</h2>
              <span>{step + 1} / 3</span>
            </div>
            <p key={"description-" + step} className="step-description">
              {steps[step].text}
            </p>
            <label className={"capture-upload " + (preview ? "has-photo" : "")}>
              {preview ? (
                <img src={preview} alt="선택한 제출 사진 미리보기" />
              ) : (
                <>
                  <Camera size={36} strokeWidth={1.3} />
                  <strong>사진 촬영 또는 선택</strong>
                  <small>JPG, PNG, WebP · 최대 10MB</small>
                </>
              )}
              <input
                aria-label="사진 선택"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 10485760) {
                    setErr("10MB 이하의 사진을 선택해 주세요.");
                    return;
                  }
                  setPhotos((ps) => ps.map((p, i) => (i === step ? f : p)));
                  setErr("");
                  e.target.value = "";
                }}
              />
              {preview && <span className="replace-photo">사진 바꾸기</span>}
            </label>
            {err && (
              <p role="alert" className="error">
                {err}
              </p>
            )}
            <div className="capture-actions">
              {step > 0 && (
                <button className="button" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={18} />
                  이전
                </button>
              )}
              {step < 2 ? (
                <button
                  className="button dark"
                  disabled={!photos[step]}
                  onClick={() => setStep(step + 1)}
                >
                  다음 사진
                  <ArrowRight size={17} />
                </button>
              ) : (
                <ActionButton
                  className="button dark"
                  busy={busy}
                  busyLabel="사진 제출 중…"
                  disabled={photos.some((p) => !p) || busy}
                  onClick={submit}
                >
                  사진 3장 제출하기
                  <ArrowRight size={17} />
                </ActionButton>
              )}
            </div>
            <p className="capture-help">
              <ShieldCheck size={16} />
              촬영이 어렵다면 기존 상담 채널로 문의해 주세요.
              <br />
              사진 미제출만으로 처리 결과가 결정되지는 않습니다.
            </p>
          </>
        )}
      </main>
      <footer>ClaimLens · 같은 기록, 더 나은 이해</footer>
    </div>
  );
}
