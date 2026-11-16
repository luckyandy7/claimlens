"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, type ComponentProps } from "react";

let current: ViewTransition | null = null;
let commit: (() => void) | null = null;
let destination = "";

export function motionEnabled() {
  return (
    typeof window !== "undefined" &&
    document.documentElement.dataset.motion !== "off" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function navigateWithTransition(href: string, navigate: () => void) {
  const next = new URL(href, location.href);
  if (
    !document.startViewTransition ||
    !motionEnabled() ||
    next.pathname === location.pathname
  ) {
    navigate();
    return;
  }
  current?.skipTransition();
  commit?.();
  document.documentElement.dataset.routeDirection =
    next.pathname === "/" || next.pathname === "/app/claims"
      ? "back"
      : "forward";
  document.documentElement.dataset.routeTransition = "active";
  destination = next.pathname;
  let timer: ReturnType<typeof setTimeout>;
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(timer);
          resolve();
        };
        commit = done;
        timer = setTimeout(done, 2500);
        navigate();
      }),
  );
  current = transition;
  void transition.ready.catch(() => {});
  void transition.finished
    .catch(() => {})
    .finally(() => {
      if (current === transition) {
        current = null;
        commit = null;
        delete document.documentElement.dataset.routeTransition;
      }
    });
}

export function RouteTransitionObserver() {
  const path = usePathname();
  useLayoutEffect(() => {
    if (path !== destination) return;
    const needsData =
      path === "/app/claims" || /^\/app\/claims\/(?!new$)[^/]+$/.test(path);
    if (!needsData || document.querySelector('[data-route-ready="true"]')) {
      commit?.();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector('[data-route-ready="true"], [role="alert"]')) {
        observer.disconnect();
        commit?.();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-route-ready"],
    });
    return () => observer.disconnect();
  }, [path]);
  useLayoutEffect(() => {
    const stop = () => {
      if (!motionEnabled()) {
        current?.skipTransition();
        commit?.();
      }
    };
    window.addEventListener("claimlens-motion", stop);
    return () => window.removeEventListener("claimlens-motion", stop);
  }, []);
  return null;
}

export default function TransitionLink(props: ComponentProps<typeof NextLink>) {
  const router = useRouter();
  return (
    <NextLink
      {...props}
      onNavigate={(e) => {
        if (
          props.onNavigate ||
          typeof props.href !== "string" ||
          !document.startViewTransition ||
          !motionEnabled()
        ) {
          props.onNavigate?.(e);
          return;
        }
        const url = new URL(props.href, location.href);
        if (url.pathname === location.pathname) return;
        e.preventDefault();
        navigateWithTransition(props.href, () =>
          router[props.replace ? "replace" : "push"](props.href as string, {
            scroll: props.scroll,
          }),
        );
      }}
    />
  );
}
