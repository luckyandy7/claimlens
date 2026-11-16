"use client";

import { useEffect } from "react";
import { motionEnabled } from "./route-transition";

// Keep the server-rendered page readable; enhancement only hides offscreen content.
export function LandingScroll() {
  useEffect(() => {
    let disposed = false;
    let teardown = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const root = document.querySelector<HTMLElement>(".cl-page");
        if (!root) return;
        let context: ReturnType<typeof gsap.context> | undefined;
        let resize: ResizeObserver | undefined;
        let frame = 0;
        const targets = new Map<HTMLElement, gsap.core.Tween>();
        const refresh = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        const setup = () => {
          context?.revert();
          resize?.disconnect();
          targets.clear();
          root
            .querySelectorAll("[data-scroll-state]")
            .forEach((el) => el.removeAttribute("data-scroll-state"));
          if (!motionEnabled()) {
            delete root.dataset.scrollMotion;
            return;
          }
          root.dataset.scrollMotion = "ready";
          context = gsap.context(() => {
            const selector = [
              ".cl-context > p",
              ".cl-context > div > *",
              ".cl-evidence-heading > *",
              ".cl-evidence-main > *",
              ".cl-evidence-secondary > *",
              ".cl-research-detail",
              ".cl-source-date",
              ".cl-process-top > *",
              ".cl-process-menu",
              ".cl-specimen",
              ".cl-principle > *",
              ".cl-value-grid > *",
              ".cl-value-outcomes > *",
              ".cl-business > *",
              ".cl-faq > h2",
              ".cl-faq-item",
              ".cl-end > *",
            ].join(",");
            const candidates = Array.from(
              root.querySelectorAll<HTMLElement>(selector),
            );
            const elements = candidates.filter(
              (el) =>
                !candidates.some(
                  (parent) => parent !== el && parent.contains(el),
                ),
            );
            elements.forEach((el, i) => {
              const below = el.getBoundingClientRect().top >= innerHeight * 0.9;
              el.dataset.scrollState = below ? "waiting" : "shown";
              if (!below) return;
              const visual = el.matches(
                ".cl-specimen,.cl-calculator-result,.cl-evidence-number",
              );
              const tween = gsap.fromTo(
                el,
                { opacity: 0, y: visual ? 58 : 36, scale: visual ? 0.965 : 1 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: visual ? 1 : 0.8,
                  delay: (i % 3) * 0.07,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 90%", once: true },
                  onStart: () => {
                    el.dataset.scrollState = "revealing";
                  },
                  onComplete: () => {
                    el.dataset.scrollState = "shown";
                  },
                },
              );
              targets.set(el, tween);
            });
            gsap.fromTo(
              ".cl-scene-photo",
              { scale: 1.08, yPercent: -3 },
              {
                scale: 1,
                yPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: ".cl-scene",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              },
            );
            gsap.fromTo(
              ".vienna-waffle i[data-filled='true']",
              { opacity: 0.15, scale: 0.85 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                stagger: 0.012,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: ".vienna-waffle",
                  start: "top 85%",
                  once: true,
                },
              },
            );
            gsap.to(".cl-scene-title", {
              yPercent: 22,
              ease: "none",
              scrollTrigger: {
                trigger: ".cl-scene",
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            });
            gsap.fromTo(
              ".cl-reading-progress",
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                },
              },
            );
            root
              .querySelectorAll<HTMLElement>(".cl-evidence-bar > span")
              .forEach((el) => {
                gsap.fromTo(
                  el,
                  { scaleX: 0 },
                  {
                    scaleX: 1,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                      trigger: el,
                      start: "top 90%",
                      once: true,
                    },
                  },
                );
              });
          }, root);
          resize = new ResizeObserver(refresh);
          resize.observe(root);
          refresh();
        };
        const focus = (event: FocusEvent) => {
          if (!(event.target instanceof Element)) return;
          for (const [el, tween] of targets)
            if (el.contains(event.target)) tween.progress(1);
        };
        setup();
        window.addEventListener("claimlens-motion", setup);
        root.addEventListener("focusin", focus);
        void document.fonts.ready.then(() => {
          if (!disposed) refresh();
        });
        teardown = () => {
          window.removeEventListener("claimlens-motion", setup);
          root.removeEventListener("focusin", focus);
          resize?.disconnect();
          cancelAnimationFrame(frame);
          context?.revert();
          delete root.dataset.scrollMotion;
        };
      },
      () => {
        /* Loading failure leaves the complete static page available. */
      },
    );
    return () => {
      disposed = true;
      teardown();
    };
  }, []);
  return <div className="cl-reading-progress" aria-hidden="true" />;
}
