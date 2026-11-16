"use client";
import Link, { navigateWithTransition } from "./route-transition";
import { ActionButton } from "./interaction-primitives";
import { ArrowUpRight, Aperture, ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={"brand " + (light ? "light" : "")}
      aria-label="ClaimLens 홈"
    >
      <span className="brand-artwork">
        <Image
          src="/brand/claimlens-logo-black-v2.png"
          alt="ClaimLens"
          width={2172}
          height={724}
          sizes="210px"
          className="brand-image"
        />
      </span>
    </Link>
  );
}
export function DemoButton({
  children = "작업공간 열기",
  className = "button dark",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <>
      <ActionButton
        className={className}
        busy={busy}
        busyLabel="작업공간 여는 중…"
        onClick={async () => {
          setBusy(true);
          try {
            await api("/api/demo", { method: "POST" });
            navigateWithTransition("/app/claims", () =>
              router.push("/app/claims"),
            );
          } catch (e) {
            setError((e as Error).message);
            setBusy(false);
          }
        }}
      >
        {children}
        <ArrowUpRight size={18} />
      </ActionButton>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </>
  );
}
export async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "요청을 처리하지 못했습니다.");
  return body;
}
export const json = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
export function Empty({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <Aperture size={32} />
      <p>{text}</p>
      {children}
    </div>
  );
}
export function Back({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="back" href={href}>
      <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
      {children}
    </Link>
  );
}
