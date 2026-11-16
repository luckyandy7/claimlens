"use client";
import {
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Check, LoaderCircle } from "lucide-react";

export function ActionButton({
  busy = false,
  busyLabel = "처리 중…",
  success = false,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean;
  busyLabel?: string;
  success?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      disabled={disabled || busy}
      aria-busy={busy}
      data-action-state={busy ? "busy" : success ? "success" : "idle"}
    >
      <span
        className="action-content"
        key={busy ? "busy" : success ? "success" : "idle"}
      >
        {busy ? (
          <>
            <LoaderCircle className="spin" size={17} />
            {busyLabel}
          </>
        ) : success ? (
          <>
            <Check size={17} />
            {children}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}

export function SelectionTrack({
  selected,
  children,
  className,
  label,
}: {
  selected: string;
  children: ReactNode;
  className: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    const el = marker.current;
    if (!root || !el) return;
    const update = () => {
      const active = root.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;
      const x = active.offsetLeft,
        y = active.offsetTop,
        w = active.offsetWidth,
        h = active.offsetHeight;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = "1";
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, [selected]);
  return (
    <div
      ref={ref}
      className={className + " selection-track"}
      role="group"
      aria-label={label}
    >
      <span ref={marker} className="selection-marker" aria-hidden="true" />
      {children}
    </div>
  );
}
