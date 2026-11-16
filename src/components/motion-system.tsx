"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play } from "lucide-react";

export function MotionSystem() {
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(localStorage.getItem("claimlens-motion") === "off");
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const running = new Set<Animation>();
    const seen = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    let mutation: MutationObserver | undefined;
    const update = () => {
      observer?.disconnect();
      mutation?.disconnect();
      running.forEach((a) => a.cancel());
      running.clear();
      const off = paused || media.matches;
      document.documentElement.dataset.motion = off ? "off" : "on";
      window.dispatchEvent(new Event("claimlens-motion"));
      if (off) return;
      const play = (el: Element, delay = 0) => {
        const bar = el.matches(
          ".cl-evidence-bar > span, .workspace-progress-fill",
        );
        const a = el.animate(
          bar
            ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
            : [
                { opacity: 0.25, transform: "translateY(18px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
          {
            duration: bar ? 1000 : 650,
            delay,
            easing: "cubic-bezier(.23,1,.32,1)",
          },
        );
        running.add(a);
        a.onfinish = () => running.delete(a);
      };
      observer = new IntersectionObserver(
        (entries) => {
          let index = 0;
          for (const entry of entries)
            if (entry.isIntersecting) {
              play(entry.target, Math.min(index++ * 70, 210));
              observer?.unobserve(entry.target);
            }
        },
        { threshold: 0.12 },
      );
      const scan = () =>
        document.querySelectorAll(".workspace-progress-fill").forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            observer?.observe(el);
          }
        });
      scan();
      mutation = new MutationObserver(scan);
      mutation.observe(document.body, { childList: true, subtree: true });
      const target = document.querySelector(".app-content, .capture-main");
      if (
        target &&
        document.documentElement.dataset.routeTransition !== "active"
      ) {
        const a = target.animate(
          [
            { opacity: 0.5, transform: "translateY(10px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 260, easing: "cubic-bezier(.23,1,.32,1)" },
        );
        running.add(a);
        a.onfinish = () => running.delete(a);
      }
    };
    update();
    media.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      mutation?.disconnect();
      running.forEach((a) => a.cancel());
      media.removeEventListener("change", update);
    };
  }, [pathname, paused]);
  return (
    <button
      className="motion-control"
      aria-label={paused ? "화면 모션 켜기" : "화면 모션 끄기"}
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        localStorage.setItem("claimlens-motion", next ? "off" : "on");
        setPaused(next);
      }}
    >
      {paused ? <Play size={14} /> : <Pause size={14} />}
      <span>모션 {paused ? "꺼짐" : "설정"}</span>
    </button>
  );
}

export function MotionNumber({
  value,
  decimals = 0,
  continuous = false,
}: {
  value: number;
  decimals?: number;
  continuous?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayed = useRef(continuous ? value : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const final = value.toLocaleString("ko-KR", {
      maximumFractionDigits: decimals,
    });
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const stop = () => {
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const start = () => {
      const from = continuous ? displayed.current : 0;
      stop();
      if (reduce.matches || document.documentElement.dataset.motion === "off")
        return;
      const beginning = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(
          (now - beginning) / (continuous ? 240 : 850),
          1,
        );
        const n = from + (value - from) * (1 - Math.pow(1 - progress, 3));
        displayed.current = n;
        el.textContent = n.toLocaleString("ko-KR", {
          maximumFractionDigits: decimals,
          minimumFractionDigits: 0,
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else stop();
      };
      frame = requestAnimationFrame(tick);
    };
    if (continuous) start();
    else
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            observer?.disconnect();
          }
        },
        { threshold: 0.5 },
      );
    observer?.observe(el);
    window.addEventListener("claimlens-motion", stop);
    reduce.addEventListener("change", stop);
    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("claimlens-motion", stop);
      reduce.removeEventListener("change", stop);
    };
  }, [value, decimals, continuous]);
  return (
    <span
      aria-label={value.toLocaleString("ko-KR", {
        maximumFractionDigits: decimals,
      })}
    >
      <span aria-hidden="true" ref={ref}>
        {value.toLocaleString("ko-KR", { maximumFractionDigits: decimals })}
      </span>
    </span>
  );
}
