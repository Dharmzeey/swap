"use client";

import { formatNaira, formatNairaShort } from "@/lib/format";
import type { EstimateResponse } from "@/lib/types";
import PhoneGlyph from "./ui/PhoneGlyph";

interface Props {
  estimate: EstimateResponse | null;
  estimate2?: EstimateResponse | null;
  compareMode?: boolean;
  loading?: boolean;
  onSave: () => void;
  onShare: () => void;
}

export default function ResultPanel({
  estimate,
  estimate2,
  compareMode,
  loading,
  onSave,
  onShare,
}: Props) {
  if (!estimate && !loading) {
    return (
      <div className="result-empty">
        <div className="result-empty-dot" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-1)" }}>
            Your estimate appears here
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            Finish all steps on both sides to see the price
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="result-empty">
        <div className="result-empty-dot" style={{ background: "var(--accent)", animation: "pulse 1.2s ease-in-out infinite" }} />
        <div style={{ fontSize: 15, color: "var(--ink-2)" }}>Calculating estimate…</div>
      </div>
    );
  }

  return (
    <div className="result">
      <div className="result-header">
        <div className="eyebrow">Estimated swap quote</div>
        <div className="result-actions">
          <button className="btn-ghost btn-sm" onClick={onSave}>Save</button>
          <button className="btn-ghost btn-sm" onClick={onShare}>Share</button>
        </div>
      </div>

      <QuoteBlock estimate={estimate!} label={compareMode ? "Option A" : undefined} />

      {compareMode && estimate2 && (
        <>
          <div style={{ height: 1, background: "var(--hairline)", margin: "24px 0" }} />
          <QuoteBlock estimate={estimate2} label="Option B" />
        </>
      )}

      {estimate && (
        <div className="repair-breakdown">
          {estimate.repair_breakdown.length > 0 && (
            <div className="breakdown-rows">
              {estimate.repair_breakdown.map((item, i) => (
                <div key={i} className="breakdown-row">
                  <span className="breakdown-name">{item.defect}</span>
                  <span className="breakdown-vals">
                    <span className="breakdown-pct">−{item.deduction_pct}%</span>
                    {item.repair_cost_ngn > 0 && (
                      <span className="breakdown-cost">+ {formatNaira(item.repair_cost_ngn)} repair</span>
                    )}
                  </span>
                </div>
              ))}
              <div className="breakdown-row breakdown-row-sub">
                <span>Service fee</span>
                <span>{formatNaira(estimate.service_fee_ngn)}</span>
              </div>
            </div>
          )}
        </div>
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

function QuoteBlock({ estimate, label }: { estimate: EstimateResponse; label?: string }) {
  const { net_ngn, direction, from_device, to_device } = estimate;
  const verb =
    direction === "upgrade" ? "You add"
    : direction === "downgrade" ? "You receive"
    : "Even swap";

  return (
    <div className="quote">
      {label && <div className="quote-label">{label}</div>}

      <div className="quote-flow">
        <div className="quote-side">
          <PhoneGlyph size={28} tone="silver" />
          <div>
            <div className="quote-side-eyebrow">From</div>
            <div className="quote-side-text">{from_device}</div>
          </div>
        </div>
        <div className="quote-arrow">→</div>
        <div className="quote-side">
          <PhoneGlyph size={28} tone="graphite" />
          <div>
            <div className="quote-side-eyebrow">To</div>
            <div className="quote-side-text">{to_device}</div>
          </div>
        </div>
      </div>

      <div className="quote-headline">
        <div className="quote-verb">{verb}</div>
        <div
          className="quote-amount"
          style={{
            color:
              direction === "upgrade" ? "var(--neg)"
              : direction === "downgrade" ? "var(--pos)"
              : "var(--ink-1)",
          }}
        >
          {direction === "even" ? "Even" : formatNairaShort(Math.abs(net_ngn))}
        </div>
        {direction !== "even" && (
          <div className="quote-conf">{formatNaira(Math.abs(net_ngn))} total</div>
        )}
      </div>
    </div>
  );
}
