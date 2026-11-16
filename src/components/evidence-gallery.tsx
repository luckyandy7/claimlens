"use client";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { motionEnabled } from "./route-transition";
import type { Asset } from "@/lib/domain";
export function EvidenceGallery({
  assets,
  onZoom,
}: {
  assets: Asset[];
  onZoom: (url: string) => void;
}) {
  const [selected, setSelected] = useState(0);
  const asset = assets[Math.min(selected, assets.length - 1)];
  if (!asset) return null;
  return (
    <div>
      <figure>
        <button
          className="image-button"
          onClick={() => onZoom(asset.url)}
          aria-label={asset.label + " 확대"}
        >
          <img
            key={asset.id}
            className="evidence-photo-enter"
            src={asset.url}
            alt={asset.label}
            width={640}
            height={540}
          />
          <span>
            <ExternalLink size={16} />
          </span>
        </button>
        <figcaption>{asset.label}</figcaption>
      </figure>
      {assets.length > 1 && (
        <div
          className="photo-thumbnails"
          role="group"
          aria-label="비교할 사진 선택"
        >
          {assets.map((a, i) => (
            <button
              key={a.id}
              aria-label={a.label + " 보기"}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <img src={a.url} alt="" width={54} height={54} />
              <span>{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function ImageDialog({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const origin = useRef<HTMLElement | null>(null);
  const entrance = useRef<Animation | null>(null);
  const photoTransform = () => {
    const image = ref.current?.querySelector("img");
    const source = origin.current?.querySelector("img");
    if (!image || !source || !source.isConnected)
      return "translateY(12px) scale(.97)";
    const a = source.getBoundingClientRect(),
      b = image.getBoundingClientRect();
    if (!b.width || !b.height || a.bottom < 0 || a.top > innerHeight)
      return "translateY(12px) scale(.97)";
    return `translate(${a.left + a.width / 2 - b.left - b.width / 2}px, ${a.top + a.height / 2 - b.top - b.height / 2}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };
  const exit = useRef<Animation | null>(null);
  const callback = useRef(onClose);
  callback.current = onClose;
  const finish = () => {
    ref.current?.close();
    callback.current();
  };
  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    const dialog = ref.current;
    if (!dialog || !motionEnabled()) {
      finish();
      return;
    }
    dialog.dataset.closing = "true";
    const currentTransform = dialog.querySelector("img")
      ? getComputedStyle(dialog.querySelector("img")!).transform
      : "none";
    entrance.current?.cancel();
    dialog.getAnimations().forEach((a) => a.cancel());
    const image = dialog.querySelector("img");
    image?.animate(
      [{ transform: currentTransform }, { transform: photoTransform() }],
      { duration: 240, easing: "cubic-bezier(.23,1,.32,1)", fill: "forwards" },
    );
    exit.current = dialog.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "none" },
      ],
      { duration: 240, easing: "cubic-bezier(.23,1,.32,1)", fill: "forwards" },
    );
    void exit.current.finished.then(finish, () => {});
  };
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    origin.current = trigger;
    dialog?.showModal();
    const image = dialog?.querySelector("img");
    let disposed = false;
    if (image)
      void image
        .decode()
        .catch(() => {})
        .then(() => {
          if (disposed || closing.current || !motionEnabled()) return;
          entrance.current = image.animate(
            [
              { transform: photoTransform(), opacity: 0.45 },
              { transform: "none", opacity: 1 },
            ],
            { duration: 280, easing: "cubic-bezier(.23,1,.32,1)" },
          );
        });
    const stop = () => {
      if (!motionEnabled()) entrance.current?.cancel();
      if (!motionEnabled() && closing.current) {
        exit.current?.cancel();
        dialog?.close();
        callback.current();
      }
    };
    window.addEventListener("claimlens-motion", stop);
    return () => {
      disposed = true;
      entrance.current?.cancel();
      window.removeEventListener("claimlens-motion", stop);
      exit.current?.cancel();
      dialog?.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="image-dialog"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      aria-label="증거 사진 확대"
    >
      <button
        className="close-modal"
        aria-label="확대 닫기"
        onClick={requestClose}
      >
        <X />
      </button>
      <img src={url} alt="확대된 증거 사진" />
    </dialog>
  );
}
