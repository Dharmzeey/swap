// Shared UI atoms + helpers for the swap estimator
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

// ---------- formatting ----------
const formatNaira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
const formatNairaShort = (n) => {
  if (n >= 1_000_000) return "₦" + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return "₦" + Math.round(n / 1000) + "k";
  return "₦" + n;
};

// ---------- smooth height transition wrapper ----------
function Reveal({ open, children, delay = 0 }) {
  const innerRef = useRef(null);
  const wrapRef = useRef(null);
  const [mounted, setMounted] = useState(open);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (open) {
      setMounted(true);
      // start from 0, animate to measured height
      wrap.style.height = "0px";
      wrap.style.opacity = "0";
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      wrap.offsetHeight;
      const target = inner.scrollHeight;
      wrap.style.height = target + "px";
      wrap.style.opacity = "1";
      const onEnd = (e) => {
        if (e.propertyName !== "height") return;
        wrap.style.height = "auto";
        wrap.removeEventListener("transitionend", onEnd);
      };
      wrap.addEventListener("transitionend", onEnd);
      return () => wrap.removeEventListener("transitionend", onEnd);
    } else {
      // collapse: lock current height, force reflow, then animate to 0
      const current = wrap.style.height === "auto" || !wrap.style.height
        ? inner.scrollHeight
        : parseFloat(wrap.style.height);
      wrap.style.height = current + "px";
      wrap.style.opacity = "1";
      // force reflow so browser registers the explicit start height
      // eslint-disable-next-line no-unused-expressions
      wrap.offsetHeight;
      requestAnimationFrame(() => {
        if (!wrapRef.current) return;
        wrapRef.current.style.height = "0px";
        wrapRef.current.style.opacity = "0";
      });
    }
  }, [open]);

  return (
    <div
      ref={wrapRef}
      style={{
        height: open ? "auto" : 0,
        overflow: "hidden",
        opacity: open ? 1 : 0,
        transition: "height 440ms cubic-bezier(.22,.61,.36,1), opacity 320ms ease",
        transitionDelay: open ? delay + "ms" : "0ms",
        willChange: "height",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

// ---------- step header ----------
function StepHeader({ index, title, hint, complete, summary, onEdit }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      gap: 16, marginBottom: 18,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
        <span style={{
          fontFeatureSettings: '"tnum"',
          fontSize: 13, color: complete ? "var(--accent)" : "var(--ink-3)",
          fontWeight: 500, letterSpacing: ".02em",
          minWidth: 22,
        }}>
          {complete ? "✓" : String(index).padStart(2, "0")}
        </span>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
            color: "var(--ink-1)",
          }}>{title}</h2>
          {hint && !complete && (
            <p style={{ margin: "4px 0 0", color: "var(--ink-3)", fontSize: 14, fontWeight: 400 }}>{hint}</p>
          )}
          {complete && summary && (
            <p style={{ margin: "4px 0 0", color: "var(--ink-2)", fontSize: 14, fontWeight: 500 }}>{summary}</p>
          )}
        </div>
      </div>
      {complete && onEdit && (
        <button onClick={onEdit} className="btn-ghost" style={{ flexShrink: 0 }}>Edit</button>
      )}
    </div>
  );
}

// ---------- Pill / chip selector ----------
function ChipGrid({ items, value, onChange, columns = "auto", minWidth = 110 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: columns === "auto"
        ? `repeat(auto-fill, minmax(${minWidth}px, 1fr))`
        : `repeat(${columns}, minmax(0, 1fr))`,
      gap: 10,
    }}>
      {items.map((it) => {
        const selected = value === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={"chip " + (selected ? "chip-selected" : "")}
          >
            <span className="chip-label">{it.label}</span>
            {it.sublabel && <span className="chip-sub">{it.sublabel}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------- iPhone silhouette (simple, abstract; no Apple branding) ----------
function PhoneGlyph({ size = 64, tone = "graphite" }) {
  const fill = tone === "graphite" ? "#1d1d1f" : tone === "silver" ? "#e5e5e7" : "#cfcfd2";
  const screen = tone === "graphite" ? "#2a2a2c" : "#f5f5f7";
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 40 64" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="36" height="60" rx="7.5" fill={fill} />
      <rect x="4" y="4" width="32" height="56" rx="5.5" fill={screen} />
      <rect x="14" y="6.5" width="12" height="3" rx="1.5" fill={fill} opacity="0.7" />
    </svg>
  );
}

Object.assign(window, { formatNaira, formatNairaShort, Reveal, StepHeader, ChipGrid, PhoneGlyph });
