import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import "./vienna.css";
import { RouteTransitionObserver } from "@/components/route-transition";
import { MotionSystem } from "@/components/motion-system";
export const metadata: Metadata = {
  title: "ClaimLens — 같은 기록, 더 나은 이해",
  description: "출고부터 반품까지, 흩어진 증거를 하나의 맥락으로.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-design="vienna">
      <body>
        <a className="skip" href="#main">
          본문으로 이동
        </a>
        {children}
        <RouteTransitionObserver />
        <MotionSystem />
      </body>
    </html>
  );
}
