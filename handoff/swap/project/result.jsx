// Result reveal — confidence range, direction, history, share.
const { useState: useStateRes, useEffect: useEffectRes, useMemo: useMemoRes } = React;

function quoteRange(fromCfg, toCfg) {
  const fromVal = window.configValue(fromCfg, true);
  const toVal = window.configValue(toCfg, false);
  const diff = toVal - fromVal; // positive => user adds money to upgrade
  // confidence band: ±6% of the larger of the two
  const band = Math.max(fromVal, toVal) * 0.06;
  const low = Math.abs(diff) - band;
  const high = Math.abs(diff) + band;
  return {
    fromVal, toVal, diff,
    direction: diff > 0 ? "add" : diff < 0 ? "receive" : "even",
    low: Math.max(0, Math.round(low / 1000) * 1000),
    high: Math.round(high / 1000) * 1000,
  };
}

function summaryLine(cfg) {
  if (!cfg.series || !cfg.variant || !cfg.storage) return "—";
  const v = window.findVariant(cfg.series, cfg.variant);
  return `${v.name} · ${cfg.storage}`;
}

function ResultPanel({ fromCfg, toCfg, toCfg2, compareMode, onSave, onShare }) {
  const ready =
    fromCfg.series && fromCfg.variant && fromCfg.storage && fromCfg.defectsCommitted &&
    toCfg.series && toCfg.variant && toCfg.storage &&
    (!compareMode || (toCfg2.series && toCfg2.variant && toCfg2.storage));

  const q1 = useMemoRes(() => ready ? quoteRange(fromCfg, toCfg) : null, [ready, fromCfg, toCfg]);
  const q2 = useMemoRes(() => ready && compareMode ? quoteRange(fromCfg, toCfg2) : null, [ready, compareMode, fromCfg, toCfg2]);

  if (!ready) {
    return (
      <div className="result-empty">
        <div className="result-empty-dot" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-1)" }}>Your estimate appears here</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Finish all steps on both sides to see the price</div>
        </div>
      </div>
    );
  }

  return (
    <div className="result">
      <div className="result-header">
        <div className="eyebrow">Estimated swap quote</div>
        <div className="result-actions">
          <button className="btn-ghost" onClick={onSave}>Save</button>
          <button className="btn-ghost" onClick={onShare}>Share</button>
        </div>
      </div>

      <QuoteBlock q={q1} fromCfg={fromCfg} toCfg={toCfg} label={compareMode ? "Option A" : null} primary />
      {compareMode && (
        <>
          <div style={{ height: 1, background: "var(--hairline)", margin: "26px 0" }} />
          <QuoteBlock q={q2} fromCfg={fromCfg} toCfg={toCfg2} label="Option B" />
        </>
      )}

      <div className="result-foot">
        <div className="result-foot-icon">i</div>
        <div>
          Quotes are an estimate based on current market value and the condition you reported.
          Final price is confirmed at inspection.
        </div>
      </div>
    </div>
  );
}

function QuoteBlock({ q, fromCfg, toCfg, label, primary }) {
  if (!q) return null;
  const verb = q.direction === "add" ? "You add" : q.direction === "receive" ? "You receive" : "Even swap";
  const headline = q.direction === "even"
    ? formatNaira(0)
    : `${formatNairaShort(q.low)} – ${formatNairaShort(q.high)}`;

  return (
    <div className={"quote " + (primary ? "quote-primary" : "")}>
      {label && <div className="quote-label">{label}</div>}
      <div className="quote-flow">
        <div className="quote-side">
          <PhoneGlyph size={28} tone="silver" />
          <div>
            <div className="quote-side-eyebrow">From</div>
            <div className="quote-side-text">{summaryLine(fromCfg)}</div>
          </div>
        </div>
        <div className="quote-arrow">→</div>
        <div className="quote-side">
          <PhoneGlyph size={28} tone="graphite" />
          <div>
            <div className="quote-side-eyebrow">To</div>
            <div className="quote-side-text">{summaryLine(toCfg)}</div>
          </div>
        </div>
      </div>

      <div className="quote-headline">
        <div className="quote-verb">{verb}</div>
        <div className="quote-amount">{headline}</div>
        <div className="quote-conf">Confidence range</div>
      </div>
    </div>
  );
}

// ---- Recently checked (localStorage) ----
function useHistory() {
  const [items, setItems] = useStateRes(() => {
    try { return JSON.parse(localStorage.getItem("swap.history") || "[]"); } catch { return []; }
  });
  const push = (entry) => {
    const next = [entry, ...items].slice(0, 6);
    setItems(next);
    try { localStorage.setItem("swap.history", JSON.stringify(next)); } catch {}
  };
  const clear = () => {
    setItems([]);
    try { localStorage.removeItem("swap.history"); } catch {}
  };
  return [items, push, clear];
}

function HistoryStrip({ items, onClear, onUse }) {
  if (!items || !items.length) return null;
  return (
    <div className="history">
      <div className="history-head">
        <div className="eyebrow">Recently checked</div>
        <button className="btn-ghost btn-tiny" onClick={onClear}>Clear</button>
      </div>
      <div className="history-row">
        {items.map((it, i) => (
          <button key={i} className="history-card" onClick={() => onUse(it)}>
            <div className="history-card-from">{it.fromText}</div>
            <div className="history-card-arrow">→</div>
            <div className="history-card-to">{it.toText}</div>
            <div className="history-card-amt">{it.amountText}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ResultPanel, useHistory, HistoryStrip, quoteRange, summaryLine });
