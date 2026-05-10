"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  children: React.ReactNode;
  delay?: number;
}

export default function Reveal({ open, children, delay = 0 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  // Tracks whether this Reveal has ever been closed. On the very first open we
  // skip the animate-from-zero so we don't measure empty content that is still
  // loading asynchronously (models / storage fetched after mount).
  const hasClosedOnce = useRef(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (open) {
      setMounted(true);
      if (!hasClosedOnce.current) {
        // First open — content may not be loaded yet; just reveal immediately.
        wrap.style.height = "auto";
        wrap.style.opacity = "1";
        return;
      }
      wrap.style.height = "0px";
      wrap.style.opacity = "0";
      wrap.offsetHeight; // force reflow
      wrap.style.height = inner.scrollHeight + "px";
      wrap.style.opacity = "1";
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "height") return;
        if (wrapRef.current) wrapRef.current.style.height = "auto";
        wrap.removeEventListener("transitionend", onEnd);
      };
      wrap.addEventListener("transitionend", onEnd);
      return () => wrap.removeEventListener("transitionend", onEnd);
    } else {
      hasClosedOnce.current = true;
      const current =
        wrap.style.height === "auto" || !wrap.style.height
          ? inner.scrollHeight
          : parseFloat(wrap.style.height);
      wrap.style.height = current + "px";
      wrap.style.opacity = "1";
      wrap.offsetHeight; // force reflow
      requestAnimationFrame(() => {
        if (!wrapRef.current) return;
        wrapRef.current.style.height = "0px";
        wrapRef.current.style.opacity = "0";
      });
    }
  }, [open]);

  if (!mounted && !open) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        height: open ? "auto" : 0,
        overflow: "hidden",
        opacity: open ? 1 : 0,
        transition: `height 400ms cubic-bezier(.22,.61,.36,1), opacity 280ms ease`,
        transitionDelay: open ? `${delay}ms` : "0ms",
        willChange: "height",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
